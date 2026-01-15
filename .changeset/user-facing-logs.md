---
"@moru-ai/cli": minor
"@moru-ai/core": patch
---

Show user-facing sandbox logs in CLI matching dashboard format

CLI logs command now displays user command outputs (stdout/stderr) instead of system logs:
- Commands shown with $ prefix
- Exit codes colored (green for success, red for errors)
- Stderr displayed in red
- New -t flag for timestamps
- New --type filter (all/stdout/stderr)

Also updates list command to use v2/sandbox-runs endpoint for historical sandbox data.
