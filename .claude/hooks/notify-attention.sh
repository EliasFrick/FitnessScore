#!/bin/bash

# Claude Attention Notification Script
# This script is triggered when Claude needs your attention

# Read JSON input from stdin
input=$(cat)

# Parse the input to determine notification type
tool_name=$(echo "$input" | jq -r '.toolName // "unknown"' 2>/dev/null)
event_type=$(echo "$input" | jq -r '.eventType // "unknown"' 2>/dev/null)

# Get current hour to avoid notifications during sleep hours (optional)
current_hour=$(date +%H)

# Skip notifications between 11 PM and 7 AM (optional - remove if not needed)
if [ $current_hour -ge 23 ] || [ $current_hour -le 6 ]; then
    exit 0
fi

# Determine the appropriate message based on the context
if [ "$tool_name" != "unknown" ] && [ "$tool_name" != "null" ]; then
    message="Claude needs your permission to use $tool_name"
elif [[ "$input" == *"permission"* ]]; then
    message="Claude needs your permission to proceed"
elif [[ "$input" == *"idle"* ]] || [[ "$event_type" == *"idle"* ]]; then
    message="Claude is waiting for your input"
else
    message="Hey! Claude needs your attention"
fi

# Use Eddy voice for notification
say -v Eddy -r 180 "$message"

# Optional: Also show a brief system notification
osascript -e "display notification \"$message\" with title \"Claude Code\" sound name \"Purr\""

exit 0