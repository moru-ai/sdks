import * as moru from '@moru-ai/core'
import * as commander from 'commander'
import * as path from 'path'
import fs from 'fs'

import { ensureAPIKey } from 'src/api'
import { spawnConnectedTerminal } from 'src/terminal'
import { asBold, asDim, asFormattedSandboxTemplate, asPrimary } from 'src/utils/format'
import { getRoot } from '../../utils/filesystem'
import { getConfigPath, loadConfig } from '../../config'
import { configOption, pathOption } from '../../options'

/**
 * `moru sandbox run` - Ephemeral sandbox execution
 *
 * Creates a sandbox, runs a command or interactive shell, then destroys the sandbox.
 *
 * Usage:
 *   moru sandbox run <template> <command...>  - Run command in ephemeral sandbox (logged to Loki)
 *   moru sandbox run -it <template>           - Run interactive shell in ephemeral sandbox (not logged)
 */
export const runCommand = new commander.Command('run')
  .description('run command in ephemeral sandbox (creates, executes, destroys)')
  .argument('[template]', `template ID for the sandbox`)
  .argument('[command...]', 'command to run in the sandbox')
  .option('-i, --interactive', 'keep stdin open')
  .option('-t, --tty', 'allocate a pseudo-TTY')
  .addOption(pathOption)
  .addOption(configOption)
  .passThroughOptions()
  .action(
    async (
      template: string | undefined,
      commandArgs: string[],
      opts: {
        interactive?: boolean
        tty?: boolean
        path?: string
        config?: string
      }
    ) => {
      try {
        const apiKey = ensureAPIKey()
        const isInteractive = opts.interactive && opts.tty

        // Resolve template from argument or config
        let templateID = template

        const root = getRoot(opts.path)
        const configPath = getConfigPath(root, opts.config)

        const config = fs.existsSync(configPath)
          ? await loadConfig(configPath)
          : undefined
        const relativeConfigPath = path.relative(root, configPath)

        if (!templateID && config) {
          console.log(
            `Found sandbox template ${asFormattedSandboxTemplate(
              {
                templateID: config.template_id,
                aliases: config.template_name
                  ? [config.template_name]
                  : undefined,
              },
              relativeConfigPath
            )}`
          )
          templateID = config.template_id
        }

        if (!templateID) {
          console.error('Error: missing required argument \'template\'')
          console.error('Usage: moru sandbox run <template> <command...>')
          console.error('       moru sandbox run -it <template>')
          process.exit(1)
        }

        // If no command and not interactive, error
        if (commandArgs.length === 0 && !isInteractive) {
          console.error('Error: specify a command or use -it for interactive shell')
          console.error('Usage: moru sandbox run <template> <command...>')
          console.error('       moru sandbox run -it <template>')
          process.exit(1)
        }

        // Create the sandbox
        const sandbox = await moru.Sandbox.create(templateID, { apiKey })
        console.log(`Sandbox ${asPrimary(sandbox.sandboxId)} created`)

        try {
          if (isInteractive) {
            // Interactive PTY mode (ephemeral)
            console.log(
              `Terminal connecting to template ${asFormattedSandboxTemplate({ templateID })} with sandbox ID ${asBold(sandbox.sandboxId)}`
            )
            await spawnConnectedTerminal(sandbox)
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
        } finally {
          // Always destroy the sandbox (ephemeral)
          await sandbox.kill()
          console.log(`Sandbox ${asPrimary(sandbox.sandboxId)} destroyed`)
          console.log(`\n${asDim('View logs:')} ${asPrimary(`moru sandbox logs ${sandbox.sandboxId}`)}`)
        }

        process.exit(process.exitCode ?? 0)
      } catch (err: any) {
        console.error(err)
        process.exit(1)
      }
    }
  )
