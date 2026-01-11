# Moru CLI

[![npm version](https://badge.fury.io/js/@moru-ai%2Fcli.svg)](https://www.npmjs.com/package/@moru-ai/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Moru CLI lets you build and manage cloud sandboxes directly from your terminal. Create isolated environments, run code safely, and develop custom templates—all with simple commands.

## Installation

### Option 1: Install Script

No Node.js required. Works on Linux and macOS with automatic PATH configuration.

```bash
curl -fsSL https://raw.githubusercontent.com/moru-ai/moru/main/install.sh | bash
```

### Option 2: npm

Good for Node.js developers. Requires Node.js 20+.

```bash
npm install -g @moru-ai/cli
```

### Option 3: Homebrew (macOS/Linux)

Simple for Homebrew users.

```bash
brew tap moru-ai/moru
brew install moru
```

**Verify Installation:**

```bash
moru --version
```

## Quick Start

### 1. Authenticate

```bash
moru auth login
```

This opens your browser for authentication. Creates an account if you don't have one yet.

> [!TIP]
> For CI/CD or headless environments, set the `MORU_ACCESS_TOKEN` environment variable.

### 2. Create Your First Sandbox

```bash
moru sandbox create base
```

**What happens:**
- Creates an isolated cloud environment
- Connects your terminal to it
- You can now run commands as if you're SSH'd into a remote machine

### 3. Try It Out

```bash
# You're now inside the sandbox!
echo "Hello from cloud sandbox!"
ls
python --version

# Upload files, run scripts, test code
echo 'print("Hello Moru!")' > test.py
python test.py
```

**Exit the sandbox:** Type `exit` or press `Ctrl+D`

## Core Concepts

**Sandbox:** An isolated cloud environment where you can run code safely. Each sandbox is ephemeral—create, use, and destroy as needed.

**Template:** A pre-configured environment (like `base`, `python`, `node`). Templates define what's installed and available in your sandbox.

**Custom Templates:** You can create your own templates with specific dependencies, tools, or configurations.

## Common Commands

### Sandbox Management

```bash
moru sandbox create <template>    # Create new sandbox
moru sandbox list                  # List all active sandboxes
moru sandbox connect <id>          # Reconnect to existing sandbox
moru sandbox kill <id>             # Delete sandbox
moru sandbox logs <id>             # View sandbox logs
```

**Aliases:** `moru sbx` works the same as `moru sandbox`

### Template Management

```bash
moru template init                 # Create new template (interactive)
moru template list                 # List your templates
moru template build                # Build template from current directory
moru template delete <name>        # Delete a template
moru template publish <name>       # Make template public
```

**Aliases:** `moru tpl` works the same as `moru template`

### Authentication

```bash
moru auth login                    # Login to Moru
moru auth info                     # View current auth status
moru auth configure                # Change team settings
moru auth logout                   # Logout
```

## Examples

### Quick Python Script

```bash
# Create Python sandbox and run script
moru sandbox create python

# Inside the sandbox:
cat > script.py << 'EOF'
import sys
print(f"Python {sys.version}")
print("Hello from Moru!")
EOF

python script.py
exit
```

### Development Workflow

```bash
# 1. Create a custom template
moru template init
# Follow prompts: Choose language, name template, configure settings

# 2. Edit template files
# Add dependencies, customize Dockerfile, etc.

# 3. Build template
cd <template-directory>
moru template build

# 4. Test it
moru sandbox create <your-template-name>
```

### Testing Code in Isolation

```bash
# Create sandbox, run tests, destroy
moru sandbox create node
npm install
npm test
exit

# Sandbox is automatically destroyed when you disconnect
```

## Need Help?

- **Documentation:** [moru.io/docs](https://moru.io/docs)
- **Command Help:** Run `moru <command> --help` for detailed options
- **Issues:** [github.com/moru-ai/moru/issues](https://github.com/moru-ai/moru/issues)

## License

MIT

---

**Built for developers who need cloud environments on-demand.** Create sandboxes for testing, development, CI/CD, or any isolated execution.
