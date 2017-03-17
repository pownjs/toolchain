const path = require('path')
const chalk = require('chalk')
const bufferSplit = require('buffer-split')
const childProcess = require('child_process')

module.exports.spawn = (command, args, options, done) => {
    const commandName = path.basename(command)
    const isParallel = options.isParallel || false

    console.log(chalk.green('*'), `${commandName} started`)

    const p = childProcess.spawn(command, args)

    let stderrDataHandler
    let stdoutDataHandler

    if (isParallel) {
        stderrDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.red(`- ${commandName}`), line.toString())
            })
        }

        stdoutDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.green(`- ${commandName}`), line.toString())
            })
        }
    } else {
        stderrDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.red('|'), line.toString())
            })
        }

        stdoutDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.green('|'), line.toString())
            })
        }
    }

    p.stderr.on('data', stderrDataHandler)
    p.stdout.on('data', stdoutDataHandler)

    p.on('exit', _ => {
        console.log(chalk.green('*'), `${commandName} finished`)

        done()
    })
}
