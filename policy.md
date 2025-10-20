# Command Execution Policies

## Overview
this policy outlines the rules for executing commands in harpertoken's ai and cli tools, ensuring safe, prioritized, and tested operations.

## Default Policies
- load default command policies for all tools
- execute_command rules apply to text processing and ai operations
- evaluate rule conditions for command-based tools
- respect priority in command execution order

## Testing Requirements
- add policy tests covering git diff and add operations
- implement system path denial for security
- test command evaluation and priority handling

## Related Tools
- harper: rust cli for text processing
- llamaware: c++ ai code assistant
- other clis in the org for kernel info and navigation
