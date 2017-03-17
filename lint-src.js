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
        const series = require('async/series')
        const parallel = require('async/parallel')

        const helpers = require('./helpers')

        const lint = (inDir, isParallel) => {
            const tasks = [
                helpers.spawnModuleBin.bind(helpers, 'eslint', ['src'], {isParallel: isParallel}),
                helpers.spawnModuleBin.bind(helpers, 'coffeelint', ['src'], {isParallel: isParallel})
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
