exports.yargs = {
    command: 'lint-src',
    describe: 'Lint source (./src)',

    builder: {
    },

    handler: (argv) => {
        const path = require('path')
        const childProcess = require('child_process')

        childProcess.spawn(path.join('node_modules', '.bin', 'eslint'), ['src'])
    }
}
