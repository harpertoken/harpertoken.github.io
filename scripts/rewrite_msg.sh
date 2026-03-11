#!/bin/bash

# Script to rewrite commit messages in git history
# Makes first line lowercase and truncates to 60 chars

git filter-branch --msg-filter '
    read msg
    first_line=$(echo "$msg" | head -n 1)
    rest=$(echo "$msg" | tail -n +2)
    # Make first line lowercase
    first_line=$(echo "$first_line" | tr "[:upper:]" "[:lower:]")
    # Add backticks around the type if it matches conventional format
    if echo "$first_line" | grep -q "^[a-z]*:"; then
        type=$(echo "$first_line" | cut -d: -f1)
        rest=$(echo "$first_line" | cut -d: -f2-)
        first_line="\`$type:\`$rest"
    fi
    # Truncate to 60 chars
    first_line=$(echo "$first_line" | cut -c1-60)
    # Output the new message
    echo "$first_line"
    echo "$rest"
' -- --all
