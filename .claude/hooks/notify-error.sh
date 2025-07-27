#!/bin/bash

# Claude Error Notification Script
# This script is triggered when Claude encounters errors

# Read JSON input from stdin
input=$(cat)

# Parse the input to determine error type
tool_name=$(echo "$input" | jq -r '.toolName // "unknown"' 2>/dev/null)
error_message=$(echo "$input" | jq -r '.error // "An error occurred"' 2>/dev/null)

# Get current hour to avoid notifications during sleep hours (optional)
current_hour=$(date +%H)

# Skip notifications between 11 PM and 7 AM (optional - remove if not needed)
if [ $current_hour -ge 23 ] || [ $current_hour -le 6 ]; then
    exit 0
fi

# Create error notification message
if [ "$tool_name" != "unknown" ] && [ "$tool_name" != "null" ]; then
    message="Error occurred with $tool_name, please check"
else
    message="Claude encountered an error, please review"
fi

# Use Eddy voice for error notification with slower, more serious tone
say -v Eddy -r 160 "$message"

# Show system notification with error sound
osascript -e "display notification \"$message\" with title \"Claude Code Error\" sound name \"Sosumi\""

exit 0