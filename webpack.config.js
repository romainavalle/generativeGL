const webpack = require("webpack");
const path = require('path');
const url = require("url")
const fs = require("fs")

const isProduction = process.argv.indexOf("--env.compress") > -1
const isClassic = process.argv.indexOf("-d") > -1
console.log('webpack isProduction?',isProduction)
console.log('webpack isClassic?',isClassic)

// ----------------------------------------------------------------------------- PLUGINS

const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const OptimizeJsPlugin = require("optimize-js-plugin");
const BabiliPlugin = require("babili-webpack-plugin")

var plugins = [
	new webpack.DefinePlugin({ isProduction: isProduction }),
	new webpack.ProvidePlugin({
		dat: "dat",
		THREE: "three",
		WAGNER: "WAGNER",
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: isProduction,
		debug: !isProduction
	}),
	new webpack.optimize.CommonsChunkPlugin({children: true, async: true}),
]

if(isProduction){
	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	plugins.push(new BabiliPlugin({}))
	// plugins.push(new webpack.optimize.UglifyJsPlugin({ beautify: false, mangle: { screw_ie8: true, keep_fnames: true },compress: {warnings: false, pure_getters: true, unsafe: true, unsafe_comps: true, screw_ie8: true }, comments: false}) )
	// plugins.push(new UglifyJsPlugin({ beautify: false, mangle: { screw_ie8: true, keep_fnames: true },compress: {warnings: false, screw_ie8: true }, comments: false}) )
	plugins.push(new OptimizeJsPlugin({sourceMap: false}))
}
else {
	if(!isClassic){
		plugins.push(new webpack.HotModuleReplacementPlugin())
	}else{
		let defaultFile = "index.html"
		let folders = [
			path.resolve(__dirname, "./app"),
			path.resolve(__dirname, "./src")
		]
		plugins.push(new BrowserSyncPlugin({ host: 'localhost', port: 9000, server: {
			baseDir: ['./app','./src'],
			files: [
				"app/css/**/*.css",
				"app/bin/*.js",
				"app/vendors/*.js",
				"app/*.html"
			]
		} }, { reload: true }))
	}
}


// ----------------------------------------------------------------------------- CONFIG

module.exports = {
	devtool: isProduction?false:'source-map',
	entry: ['babel-polyfill',__dirname+"/src/js/Main"],
	output: {
		path: path.resolve(__dirname,'app/bin/'),
		filename: 'bundle.js',
		chunkFilename: "[id].bundle.js",
		publicPath: isProduction?'./bin/':'/bin/'
	},
	module: {
		loaders: [
      		{ test: /\.(glsl|frag|vert|fs|vs)$/, exclude:[/node_modules|vendors/], loader: 'shader-loader' },
			{ test: /\.jsx?$/, 
				exclude:[/node_modules|vendors/],
				loader:'babel-loader', query: {
				plugins: isProduction?['transform-runtime']:[],
				presets: [
					['es2015',{loose:true,modules:false}],
					["stage-0"],
				],
				retainLines:false,
			} },
			{
        test: /\.(html)$/,
        use: ['raw-loader']
      },
		],
	},
	resolve: {
		extensions:['.json','.js','.glsl','.vs','.fs'],
		modules: [
			path.resolve(__dirname,'src/js'),
			path.resolve(__dirname,'src/glsl'),
			path.resolve(__dirname,'node_modules'),
			path.resolve(__dirname,'app/vendors'),
		],
		alias: {
			dat: 		path.resolve(__dirname+'/app/vendors/dat.gui.js'),
			WAGNER: 	path.resolve(__dirname+'/app/vendors/WAGNER.js'),
		}
	},
	devServer: {
		open:true,
		compress:true,
		inline:true,
		https:true,
		noInfo:false,
		port:9000,
		contentBase: ['./app','./src'],
		stats: { colors: true }
	},
	plugins:plugins
};
