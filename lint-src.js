exports.yargs = {
    command: 'lint-src',
    describe: 'Lint source (./src)',

    builder: {
        parallel: {
            alias: 'p',
            type: 'boolean',
            default: false,
            describe: 'Execute in parallel'
        }
    },

    handler: (argv) => {
        const path = require('path')
        const chalk = require('chalk')
        const series = require('async/series')
        const parallel = require('async/parallel')

        const helpers = require('./helpers')

        const lint = (inDir, isParallel) => {
            const tasks = [
                helpers.spawn.bind(helpers, path.join('node_modules', '.bin', 'eslint'), ['src'], {isParallel: isParallel}),
                helpers.spawn.bind(helpers, path.join('node_modules', '.bin', 'coffeelint'), ['src'], {isParallel: isParallel})
            ]

            if (isParallel) {
                parallel(tasks, () => {})
            } else {
                series(tasks, () => {})
            }
        }

        const inDir = 'src'

        lint(inDir, argv.parallel)
    }
}
