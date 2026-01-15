<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/moru-ai/.github/main/logo/moru-logo-white.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/moru-ai/.github/main/logo/moru-logo.svg">
    <img alt="Moru" src="https://raw.githubusercontent.com/moru-ai/.github/main/logo/moru-logo.svg" width="200">
  </picture>
</p>

<p align="center">
  <b>Open-source cloud runtime for AI agents.</b><br>
  Give your AI agents a full Linux VM to work with.
</p>

---

Run agent harnesses like Claude Code or Codex in the cloud, giving each session its own isolated microVM with filesystem and shell access. From outside, you talk to the VM through the Moru CLI or TypeScript/Python SDK. Inside, it's just Linux—run commands, read/write files, anything you'd do on a normal machine.

## Why Moru?

When an agent needs to solve complex problems, giving it filesystem + shell access works well because:

1. It handles large data without pushing everything into the model context window
2. It reuses tools that already work (Python, Bash, etc.)
3. Models are trained to be good at using shell commands and writing code

Now models run for hours on real tasks. As models get smarter, the harness should give models more autonomy, but with safe guardrails. Moru helps developers focus on building agents, not the underlying runtime and infra.

## Quickstart

The fastest way to try Moru is with the CLI.

### Install the CLI

```bash
curl -fsSL https://moru.io/cli/install.sh | bash
```

### Hello World

```bash
# Login
moru auth login

# Run a command and get destroyed automatically
moru sandbox run base echo 'hello world!'

# List sandboxes
moru sandbox list

# View logs
moru sandbox logs <id>
```

### Create/Kill

```bash
# Create a sandbox
moru sandbox create base

# Run a command inside
moru sandbox exec <id> 'sh -c "echo Hello Moru > /tmp/note.txt"'

# Run another command
moru sandbox exec <id> cat /tmp/note.txt

# Kill when done
moru sandbox kill <id>
```

## Using SDKs

### Install

**JavaScript / TypeScript:**

```bash
npm install @moru-ai/core
```

**Python:**

```bash
pip install moru
```

### API Key set up

```bash
export MORU_API_KEY=your_api_key
```

**Go to the [API Keys tab](https://moru.io/dashboard?tab=keys)** if you didn't create an API key yet.

### Create/Kill

**JavaScript / TypeScript:**

```ts
import Sandbox from '@moru-ai/core'

// Create a sandbox using the 'base' template (default)
const sandbox = await Sandbox.create()
console.log(`Sandbox created: ${sandbox.sandboxId}`)

// Run a command
const result = await sandbox.commands.run("echo 'Hello from Moru!'")
console.log(`Output: ${result.stdout}`)

// Clean up
await sandbox.kill()
```

**Python:**

```python
from moru import Sandbox

# Create a sandbox using the 'base' template (default)
sandbox = Sandbox.create()
print(f"Sandbox created: {sandbox.sandbox_id}")

# Run a command
result = sandbox.commands.run("echo 'Hello from Moru!'")
print(f"Output: {result.stdout}")

# Clean up
sandbox.kill()
```

### Streaming Output

Stream stdout/stderr in real-time for long-running commands.

**JavaScript / TypeScript:**

```ts
await sandbox.commands.run("for i in 1 2 3; do echo $i; sleep 1; done", {
  onStdout: (data) => console.log(data),
  onStderr: (data) => console.error(data),
})
```

**Python:**

```python
sandbox.commands.run(
    "for i in 1 2 3; do echo $i; sleep 1; done",
    on_stdout=lambda data: print(data),
    on_stderr=lambda data: print(data),
)
```

### Monitor Sandbox Logs

After running your sandbox, you can view logs, monitor activity, and debug issues from the [Sandboxes tab](https://moru.io/dashboard?tab=sandboxes) in your dashboard.

## Using a Custom Template

With custom templates, you can build your own VM snapshot with your own agent pre-installed. See the [Maru agent example](https://github.com/moru-ai/maru/tree/main/apps/agent) and the [templates documentation](https://moru.io/docs/templates/overview) for more information.

```python
# Python
sandbox = Sandbox.create("my-template")
```

```ts
// JavaScript
const sandbox = await Sandbox.create('my-template')
```

## How It Works

Each VM is a snapshot of a Docker build. You define a Dockerfile, CPU, and memory limits—Moru runs the build inside a Firecracker VM, then pauses and saves the exact state: CPU, dirty memory pages, and changed filesystem blocks.

When you spawn a new VM, it resumes from that template snapshot. Memory snapshots are lazy-loaded via userfaultfd, which helps sandboxes start within a second.

Each VM runs on Firecracker with KVM isolation and a dedicated kernel. Network uses namespaces for isolation and iptables for access control.

## Documentation

For more information, visit [moru.io/docs](https://moru.io/docs).

## Related

- [Maru](https://github.com/moru-ai/maru) - A research assistant using Claude Agent SDK and Moru
- [Sandbox Infrastructure](https://github.com/moru-ai/sandbox-infra) - Self-host the Firecracker runtime

## Acknowledgement

Moru started as a fork of [E2B](https://github.com/e2b-dev/E2B), and most of the low-level Firecracker runtime is still from upstream.

## License

See [LICENSE](LICENSE) file.
