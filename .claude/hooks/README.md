# Claude Code Voice Notifications Setup

This directory contains Claude Code hooks configuration for voice notifications using the macOS "Eddy" voice.

## Features

- **Voice Notifications**: Uses macOS text-to-speech with Eddy voice
- **Smart Timing**: Automatically skips notifications during sleep hours (11 PM - 7 AM)
- **Multiple Event Types**: Different notifications for different Claude events
- **System Integration**: Shows both voice and system notifications

## Hook Scripts

### `notify-attention.sh`
Triggered when Claude needs your attention:
- Tool permission requests
- Input idle notifications
- General attention needs

### `notify-complete.sh` 
Triggered when Claude finishes tasks:
- Main agent completion
- Sub-agent completion
- Success/failure status

### `notify-error.sh`
Triggered when errors occur:
- Tool execution failures
- Error conditions

## Configuration

The hooks are configured in `.claude/settings.json` with the following events:

- **Notification**: When Claude needs permission or input is idle
- **Stop**: When main Claude agent finishes responding
- **SubagentStop**: When sub-agents finish their tasks
- **PostToolUse**: After tool execution (for error handling)

## Customization

### Voice Settings
Change voice, rate, or volume by editing the `say` command in the scripts:
```bash
say -v Eddy -r 180 "$message"  # Current: Eddy voice, 180 words/min
```

Available voices can be listed with: `say -v '?'`

### Quiet Hours
Modify the sleep hours by changing this section in each script:
```bash
# Skip notifications between 11 PM and 7 AM
if [ $current_hour -ge 23 ] || [ $current_hour -le 6 ]; then
    exit 0
fi
```

### Disable System Notifications
Comment out or remove the `osascript` lines to disable visual notifications:
```bash
# osascript -e "display notification \"$message\" with title \"Claude Code\" sound name \"Purr\""
```

## Testing

To test the hooks manually:
```bash
# Test attention notification
echo '{"toolName": "Bash", "eventType": "permission"}' | ./.claude/hooks/notify-attention.sh

# Test completion notification  
echo '{"success": true, "eventType": "Stop"}' | ./.claude/hooks/notify-complete.sh

# Test error notification
echo '{"toolName": "Write", "error": "Permission denied"}' | ./.claude/hooks/notify-error.sh
```

## Requirements

- macOS with built-in text-to-speech
- Eddy voice installed (available in System Preferences > Accessibility > Spoken Content)
- jq command-line tool for JSON parsing (install with `brew install jq`)

## Installation Notes

1. Ensure all scripts are executable: `chmod +x .claude/hooks/*.sh`
2. Install jq if not present: `brew install jq`  
3. Verify Eddy voice is available: `say -v Eddy "test"`
4. Test hooks manually before relying on them

The hooks will automatically activate when Claude Code runs in this project directory.