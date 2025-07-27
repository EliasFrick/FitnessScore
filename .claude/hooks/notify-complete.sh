#!/bin/bash

# Claude Task Completion Notification Script
# This script is triggered when Claude finishes tasks

# Read JSON input from stdin
input=$(cat)

# Parse the input to determine completion type
tool_name=$(echo "$input" | jq -r '.toolName // "unknown"' 2>/dev/null)
success=$(echo "$input" | jq -r '.success // true' 2>/dev/null)
event_type=$(echo "$input" | jq -r '.eventType // "unknown"' 2>/dev/null)

# Get current hour to avoid notifications during sleep hours (optional)
current_hour=$(date +%H)

# Skip notifications between 11 PM and 7 AM (optional - remove if not needed)
if [ $current_hour -ge 23 ] || [ $current_hour -le 6 ]; then
    exit 0
fi

# Determine the appropriate completion message
if [ "$success" = "false" ]; then
    message="Task encountered an error, please check the results"
    sound="Basso"
elif [ "$event_type" = "SubagentStop" ]; then
    message="Sub-task completed successfully"
    sound="Purr"
elif [ "$tool_name" != "unknown" ] && [ "$tool_name" != "null" ]; then
    message="$tool_name operation completed successfully"
    sound="Purr"
else
    message="All tasks finished, ready for next instruction"
    sound="Glass"
fi

# Use Eddy voice for notification with slightly faster rate for completion messages
say -v Eddy -r 200 "$message"

# Show system notification with appropriate sound
osascript -e "display notification \"$message\" with title \"Claude Code\" sound name \"$sound\""

exit 0