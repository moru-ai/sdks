---
"@moru-ai/cli": minor
---

Improve CLI user experience with helpful command suggestions and better table display

- Show suggested command after successful login: `moru sandbox run base echo 'hello world!'`
- Show logs command with sandbox ID after `moru sandbox run` completes
- Remove verbose header/footer messages from `moru sandbox logs` output
- Improve `moru sandbox list` table: green highlighting for running sandboxes, reordered columns, renamed "Alias" to "Template Name"
