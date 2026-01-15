import * as moru from '@moru-ai/core'
import * as commander from 'commander'

import { ensureAPIKey } from 'src/api'
import { spawnConnectedTerminal } from 'src/terminal'
import { asBold, asPrimary } from 'src/utils/format'

/**
 * `moru sandbox exec` - Execute commands in existing sandbox
 *
 * Runs a command or interactive shell in an already-running sandbox.
 * The sandbox is NOT destroyed after execution.
 *
 * Usage:
 *   moru sandbox exec <id> <command...>  - Run command in existing sandbox (logged to Loki)
 *   moru sandbox exec -it <id>           - Run interactive shell in existing sandbox (not logged)
 */
export const execCommand = new commander.Command('exec')
  .description('run command in existing sandbox')
  .argument('[id]', 'sandbox ID')
  .argument('[command...]', 'command to run in the sandbox')
  .option('-i, --interactive', 'keep stdin open')
  .option('-t, --tty', 'allocate a pseudo-TTY')
  .passThroughOptions()
  .action(
    async (
      sandboxId: string | undefined,
      commandArgs: string[],
      opts: {
        interactive?: boolean
        tty?: boolean
      }
    ) => {
      try {
        const apiKey = ensureAPIKey()
        const isInteractive = opts.interactive && opts.tty

        if (!sandboxId) {
          console.error('Error: missing required argument \'id\'')
          console.error('Usage: moru sandbox exec <id> <command...>')
          console.error('       moru sandbox exec -it <id>')
          process.exit(1)
        }

        // If no command and not interactive, error
        if (commandArgs.length === 0 && !isInteractive) {
          console.error('Error: specify a command or use -it for interactive shell')
          console.error('Usage: moru sandbox exec <id> <command...>')
          console.error('       moru sandbox exec -it <id>')
          process.exit(1)
        }

        // Connect to existing sandbox
        const sandbox = await moru.Sandbox.connect(sandboxId, { apiKey })

        if (isInteractive) {
          // Interactive PTY mode (not logged)
          console.log(
            `Terminal connecting to sandbox ${asPrimary(sandbox.sandboxId)}`
          )
          await spawnConnectedTerminal(sandbox)
          console.log(
            `Closing terminal connection to sandbox ${asPrimary(sandbox.sandboxId)}`
          )
        } else {
          // Non-interactive command execution (logged to Loki)
          const command = commandArgs.join(' ')
          const result = await sandbox.commands.run(command, {
            onStdout: (data) => { process.stdout.write(data) },
            onStderr: (data) => { process.stderr.write(data) },
          })

          if (result.exitCode !== 0) {
            process.exitCode = result.exitCode
          }
        }

        // We explicitly call exit because the sandbox may be keeping the program alive.
        // We don't kill the sandbox - it stays alive for other users/commands.
        process.exit(process.exitCode ?? 0)
      } catch (err: any) {
        // Check if sandbox not found
        if (err?.message?.includes('not found') || err?.status === 404) {
          console.error(`Error: sandbox '${sandboxId}' not found`)
          process.exit(1)
        }
        console.error(err)
        process.exit(1)
      }
    }
  )
