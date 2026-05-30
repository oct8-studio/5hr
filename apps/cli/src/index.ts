import { Command } from 'commander'
import { initCmd } from './commands/init.js'
import { todayCmd } from './commands/today.js'
import { explainCmd } from './commands/explain.js'
import { startCmd } from './commands/start.js'
import { stopCmd } from './commands/stop.js'
import { scheduleCmd } from './commands/schedule.js'
import { statsCmd } from './commands/stats.js'
import { doctorCmd } from './commands/doctor.js'

const program = new Command('5hr')
  .description('Quota-aware scheduling for AI coding sessions')
  .version('0.1.0')

program.addCommand(initCmd)
program.addCommand(todayCmd)
program.addCommand(explainCmd)
program.addCommand(startCmd)
program.addCommand(stopCmd)
program.addCommand(scheduleCmd)
program.addCommand(statsCmd)
program.addCommand(doctorCmd)

program.parse()
