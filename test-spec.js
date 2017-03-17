exports.yargs = {
    command: 'test-spec',
    describe: 'Test spec (./spec)',

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

        const test = (inDir, isParallel) => {
            const tasks = [
                helpers.spawnModuleBin.bind(helpers, 'jest', ['spec'], {isParallel: isParallel})
            ]

            if (isParallel) {
                parallel(tasks, () => {})
            } else {
                series(tasks, () => {})
            }
        }

        const inDir = 'spec'

        test(inDir, argv.parallel)
    }
}
