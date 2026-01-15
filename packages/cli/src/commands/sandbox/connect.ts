import * as moru from '@moru-ai/core'
import * as commander from 'commander'

import { spawnConnectedTerminal } from 'src/terminal'
import { asBold, asPrimary } from 'src/utils/format'
import { ensureAPIKey } from '../../api'

/**
 * `moru sandbox connect` - DEPRECATED
 *
 * This command is deprecated. Use `moru sandbox exec -it <id>` instead.
 *
 * Kept as a hidden alias for backward compatibility.
 */
export const connectCommand = new commander.Command('connect')
  .description('connect terminal to already running sandbox (DEPRECATED: use exec -it)')
  .argument('<sandboxID>', `connect to sandbox with ${asBold('<sandboxID>')}`)
  .alias('cn')
  .action(async (sandboxID: string) => {
    // Show deprecation warning
    console.warn(
      `Warning: 'connect' is deprecated, use 'exec -it' instead`
    )

    try {
      const apiKey = ensureAPIKey()

      if (!sandboxID) {
        console.error('You need to specify sandbox ID')
        process.exit(1)
      }

      await connectToSandbox({ apiKey, sandboxID })
      // We explicitly call exit because the sandbox is keeping the program alive.
      // We also don't want to call sandbox.close because that would disconnect other users from the edit session.
      process.exit(0)
    } catch (err: any) {
      // Check if sandbox not found
      if (err?.message?.includes('not found') || err?.status === 404) {
        console.error(`Error: sandbox '${sandboxID}' not found`)
        process.exit(1)
      }
      console.error(err)
      process.exit(1)
    }
  })

async function connectToSandbox({
  apiKey,
  sandboxID,
}: {
  apiKey: string
  sandboxID: string
}) {
  const sandbox = await moru.Sandbox.connect(sandboxID, { apiKey })

  console.log(
    `Terminal connecting to sandbox ${asPrimary(`${sandbox.sandboxId}`)}`
  )
  await spawnConnectedTerminal(sandbox)
  console.log(
    `Closing terminal connection to sandbox ${asPrimary(sandbox.sandboxId)}`
  )
}
