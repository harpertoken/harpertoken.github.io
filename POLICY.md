# Command Execution Policies

This document defines *how command execution must work* across harpertoken tools
that can run shell or git commands (for example: `harper`, `llamaware`).

The goal is to be explicit about what is allowed, what is blocked, and what must
require user approval.

## Core Principles
- **User consent first**: commands do not run without explicit user approval unless
  they are covered by a narrow, pre-configured allowlist.
- **Defense in depth**: even with approval, commands are validated and dangerous
  patterns are blocked.
- **Least privilege**: prefer sandboxed execution with minimal filesystem access,
  no network, and tight resource limits.
- **Auditable**: command attempts (including blocked/cancelled) should be logged.

## Parsing & Execution Model
- Commands are treated as a **single command segment**.
- **Shell chaining and redirection are not allowed** (defense-in-depth):
  - Block metacharacters like `;`, `|`, `&`, backticks, `$()`, `<`, `>`, and newlines.
  - Rationale: prevents “do X and then do Y” or hidden side-effects.
- Prefer **token/starts-with validation** rather than substring matching where practical
  to reduce false positives/negatives.

## Hard Blocks (Always Deny)
Commands must be rejected even if a user tries to approve them when they match
dangerous patterns such as:
- Destructive file/system operations: `rm -rf`, `mkfs`, `fdisk`, `dd if=`, `dd of=`
- Privilege escalation: `sudo`, `su`, password/account changes
- Network-capable tooling in restricted contexts: `curl`, `wget`, `ssh`, `scp`, `nc`
- Direct sensitive paths or system management (example patterns): `/etc/`, `/sbin/`,
  `systemctl`, `service`, `iptables`, `ufw`
- Script-eval patterns: `eval`, `exec`, `source`, `bash -c`, `sh -c`, `python -c`, etc.

Notes:
- Specific blocklists vary by tool, but the intent is consistent: **no escalation,
  no networking, no raw device/system modification**.

## Allowlist & Approval Rules
Tools may support an execution policy configuration:
- `blocked_commands`: if a command starts with a blocked prefix → **deny**.
- `allowed_commands`: if set, only commands starting with an allowed prefix can be
  executed *without asking*; everything else still requires approval (or is denied,
  depending on the tool).
- If no allowlist is configured, commands should default to **requiring approval**.

Approval UX requirements:
- Show the **exact command** being requested.
- Make it easy to reject.
- Record rejected attempts in audit logs.

## Sandbox Defaults (Recommended)
When tools provide sandboxed execution, defaults should be:
- **Network disabled** (for example Docker `--network=none`)
- **Tight limits** (CPU, memory, and timeouts)
- **Minimal allowed commands** per sandbox profile

Example implementations in the org (source of truth):
- `harper`: command tool safety checks + approval + audit logging
  (`harper/lib/harper-core/src/tools/shell.rs`, `harper/lib/harper-core/src/tools/git.rs`)
- `llamaware`: sandbox configs default to no network + resource limits
  (`llamaware/src/services/sandbox_service.cpp`, `llamaware/include/services/sandbox_service.h`)

## Output & Timeouts
- Commands should have **bounded output** (truncate with clear marker).
- Commands should have **bounded runtime** (tool-level timeout + sandbox timeout if applicable).
- Include exit code or failure reason in responses.

## Audit Logging
At minimum, log:
- command string (or normalized representation)
- decision: executed / blocked / cancelled
- whether approval was required and whether it was granted
- timestamp + duration
- tool/source context (session id if available)

## Testing Requirements
Add/maintain automated tests that cover:
- metacharacter blocking (no chaining / redirection)
- hard-block patterns (e.g. `rm -rf`, `sudo`, `curl`)
- allowlist/blocked-list precedence and matching behavior
- approval flow (approved vs rejected)
- audit log entries for executed and blocked/cancelled commands
