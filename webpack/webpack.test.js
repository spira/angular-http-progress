var loaders = require("./loaders");
var webpack = require('webpack');
module.exports = {
    entry: ['./src/ngJwtAuth.ts'],
    output: {
        filename: 'build.js',
        path: 'tmp'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json'],
        alias: {
            sinon: 'sinon/pkg/sinon' //this fixes require function is used in a way in which dependencies cannot be statically extracted@ ./~/sinon/pkg/sinon-server-1.16.1.js error. See https://github.com/webpack/webpack/issues/304#issuecomment-193319594 for fix origin
        }
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: "source-map-inline",
    module: {
        loaders: loaders,
        postLoaders: [
            {
                test: /^((?!\.spec\.ts).)*.ts$/,
                exclude: /(node_modules)/,
                loader: 'istanbul-instrumenter'
            }
        ]
    },
    ts: {
        configFileName: 'tsconfig.test.json'
    }
};
