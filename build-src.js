exports.yargs = {
    command: 'build-src',
    describe: 'Build source (./src)',

    builder: {
        yes: {
            alias: 'y',
            type: 'boolean',
            default: false,
            describe: 'Yes to everything'
        },

        maps: {
            alias: 'm',
            type: 'boolean',
            default: false,
            describe: 'Produce source maps'
        },

        babel: {
            alias: 'b',
            type: 'boolean',
            default: true,
            describe: 'Compile babel'
        },
        
        coffee: {
            alias: 'c',
            type: 'boolean',
            default: true,
            describe: 'Compile coffee'
        },

        parallel: {
            alias: 'p',
            type: 'boolean',
            default: false,
            describe: 'Execute in parallel'
        }
    },

    handler: (argv) => {
        const chalk = require('chalk')
        const extfs = require('extfs')
        const inquirer = require('inquirer')
        const series = require('async/series')
        const parallel = require('async/parallel')
        
        const helpers = require('./helpers')

        const build = (shouldClean, inDir, outDir, sourceMaps, isParallel) => {
            if (shouldClean) {
                console.log(chalk.green('*'), `cleaning ${outDir}`)

                extfs.removeSync(outDir)
            }

            const tasks = []

            if (argv.babel) {
                tasks.push(helpers.spawnModuleBin.bind(helpers, 'babel', (sourceMaps ? ['-s', 'true'] : []).concat(['--copy-files', '--ignore', '*.coffee', '-x', '.js,.jsx,.es6,.es', inDir, '-d', outDir]), {isParallel: isParallel}))
            }

            if (argv.coffee) {
                tasks.push(helpers.spawnModuleBin.bind(helpers, 'coffee', (sourceMaps ? ['-m'] : []).concat(['-o', outDir, '-c', inDir]), {isParallel: isParallel}))
            }

            if (isParallel) {
                parallel(tasks, () => {})
            } else {
                series(tasks, () => {})
            }
        }

        const inDir = 'src'
        const outDir = 'lib'

        if (!extfs.isEmptySync(outDir)) {
            if (argv.y) {
                build(true, inDir, outDir, argv.maps, argv.parallel)
            } else {
                inquirer.prompt([{type: 'confirm', name: 'q', default: false, message: `The contents of ${outDir} will be deleted. Do you want to proceed?`}])
                .then(r => r.q && build(true, inDir, outDir, argv.maps, argv.parallel))
                .catch(e => console.error(chalk.red('-'), e.message || e))
            }
        } else {
            build(false, inDir, outDir, argv.maps, argv.parallel)
        }
    }
}
