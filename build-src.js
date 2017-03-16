exports.yargs = {
    command: 'build-src',
    describe: 'Build source (./src)',

    builder: {
    },

    handler: (argv) => {
        const path = require('path')
        const childProcess = require('child_process')

        childProcess.spawn(path.join('node_modules', '.bin', 'babel'), ['src', '-d', 'lib'])
    }
}
