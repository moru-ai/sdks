---
"@moru-ai/cli": minor
---

Add run and exec commands for sandbox management

- `sandbox run <template> <cmd>`: Run command in ephemeral sandbox (creates, executes, destroys)
- `sandbox run -it <template>`: Interactive shell in ephemeral sandbox
- `sandbox exec <id> <cmd>`: Run command in existing sandbox
- `sandbox exec -it <id>`: Interactive shell in existing sandbox
- `sandbox create` now only creates (use `-it` for interactive)
- Commands work without quotes (e.g., `sandbox run base uname -a`)
- Updated primary color to cyan (#00D1FF)
