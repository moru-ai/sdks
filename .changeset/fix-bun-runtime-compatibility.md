---
"@moru-ai/cli": patch
---

Fix crash when running terminal commands with Bun-compiled binary. Check if process.stdin.setRawMode and process.stdout.setEncoding are functions before calling them to prevent TypeError in Bun runtime.
