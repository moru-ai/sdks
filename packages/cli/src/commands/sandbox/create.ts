import * as moru from '@moru-ai/core'
import * as commander from 'commander'
import * as path from 'path'

import { ensureAPIKey } from 'src/api'
import { spawnConnectedTerminal } from 'src/terminal'
import { asBold, asFormattedSandboxTemplate, asPrimary } from 'src/utils/format'
import { getRoot } from '../../utils/filesystem'
import { getConfigPath, loadConfig } from '../../config'
import fs from 'fs'
import { configOption, pathOption } from '../../options'

/**
 * `moru sandbox create` - Create a sandbox
 *
 * Creates a sandbox that stays alive. Optionally connects an interactive PTY.
 *
 * Usage:
 *   moru sandbox create <template>     - Create sandbox, print ID, exit (sandbox stays alive)
 *   moru sandbox create -it <template> - Create sandbox, connect interactive PTY (sandbox stays alive after exit)
 */
export function createCommand(
  name: string,
  alias: string
) {
  return new commander.Command(name)
    .description('create sandbox (use -it for interactive terminal)')
    .argument(
      '[template]',
      `create sandbox with ${asBold('[template]')}`
    )
    .option('-i, --interactive', 'keep stdin open')
    .option('-t, --tty', 'allocate a pseudo-TTY')
    .addOption(pathOption)
    .addOption(configOption)
    .alias(alias)
    .action(
      async (
        template: string | undefined,
        opts: {
          interactive?: boolean
          tty?: boolean
          name?: string
          path?: string
          config?: string
        }
      ) => {
        try {
          const apiKey = ensureAPIKey()
          const isInteractive = opts.interactive && opts.tty

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
            console.error('Usage: moru sandbox create <template>')
            console.error('       moru sandbox create -it <template>')
            process.exit(1)
          }

          // Create the sandbox
          const sandbox = await moru.Sandbox.create(templateID, { apiKey })
          console.log(`Sandbox ${asPrimary(sandbox.sandboxId)} created`)

          if (isInteractive) {
            // Interactive mode: connect PTY, sandbox stays alive after exit
            // Keep-alive loop to prevent sandbox from timing out during interactive session
            const intervalId = setInterval(async () => {
              await sandbox.setTimeout(30_000)
            }, 5_000)

            console.log(
              `Terminal connecting to template ${asFormattedSandboxTemplate(
                { templateID }
              )} with sandbox ID ${asBold(`${sandbox.sandboxId}`)}`
            )
            try {
              await spawnConnectedTerminal(sandbox)
            } finally {
              clearInterval(intervalId)
              console.log(
                `Closing terminal connection to template ${asFormattedSandboxTemplate(
                  { templateID }
                )} with sandbox ID ${asBold(`${sandbox.sandboxId}`)}`
              )
              // NOTE: We do NOT kill the sandbox here - it stays alive
              // Use `moru sandbox kill <id>` to destroy it
            }
          }
          // Without -it: just print the sandbox ID and exit
          // Sandbox stays alive for later use with `moru sandbox exec`

          process.exit(0)
        } catch (err: any) {
          console.error(err)
          process.exit(1)
        }
      }
    )
}
