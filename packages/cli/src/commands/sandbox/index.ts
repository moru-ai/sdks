import * as commander from 'commander'

import { listCommand } from './list'
import { killCommand } from './kill'
import { createCommand } from './create'
import { runCommand } from './run'
import { execCommand } from './exec'
import { logsCommand } from './logs'
import { metricsCommand } from './metrics'

export const sandboxCommand = new commander.Command('sandbox')
  .description('work with sandboxes')
  .alias('sbx')
  .enablePositionalOptions()
  // Core commands (Docker/kubectl style)
  .addCommand(createCommand('create', 'cr'))
  .addCommand(runCommand)
  .addCommand(execCommand)
  // Management commands
  .addCommand(listCommand)
  .addCommand(killCommand)
  .addCommand(logsCommand)
  .addCommand(metricsCommand)
