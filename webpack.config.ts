import path from 'node:path';
import fs from 'node:fs';
import https from 'node:https';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
// import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.common.config';
import dotenv from 'dotenv';

const envFiles = ['.env'];

if (process.env.MODE) {
  envFiles.push(`.env.${process.env.MODE}`);
}
dotenv.config({ path: envFiles });

// const agent = process.env.AGENT_CERT_1
//   ? new https.Agent({
//       key: fs.readFileSync(process.env.AGENT_CERT_1).toString(),
//       ca2: fs.readFileSync(process.env.AGENT_CERT_2).toString(),
//       ca3: fs.readFileSync(process.env.AGENT_CERT_3).toString(),
//       rejectUnauthorized: false,
//     })
//   : undefined;

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const config: Configuration & { devServer?: DevServerConfiguration } = merge(common, {
  mode: isDev ? 'development' : 'production',
  entry: { app: './src/main.tsx' },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist/app'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new HotModuleReplacementPlugin(),
  ],
  devtool: isDev ? 'inline-source-map' : undefined,
  devServer: isDev
    ? {
        port: process.env.PORT || '3000',
        host: process.env.HOST || '0.0.0.0',
        open: true,
        hot: true,
        historyApiFallback: true,
      //   proxy: process.env.PROXY_HOST
      //     ? [
      //         {
      //           context: process.env.PROXY_API_PREFIX,
      //           target: process.env.PROXY_HOST,
      //           secure: false,
      //           agent: agent,
      //         },
      //       ]
      //     : undefined,
      }
    : undefined,
});

export default config;

//////////////////////////////////////////////
//
//
//

// import path from 'node:path';
// import fs from 'node:fs';
// import https from 'node:https';
// import { Configuration, HotModuleReplacementPlugin } from 'webpack';
// import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
// // import CopyWebpackPlugin from "copy-webpack-plugin";
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { merge } from 'webpack-merge';
// import common from './webpack.common.config';
// import 'dotenv/config';

// const MODE = process.env.MODE || 'LOCAL';
// let isProd = process.env.NODE_ENV === 'production';
// let isDev = !isProd;

// let baseConfig = {
//   HOST: '0.0.0.0',
//   PORT: 3000,
//   BASE_PREFIX: '/',
//   OUTPUT_DIR: 'build',
// };

// let porxyConfig = {
//   PROXY_API_PREFIX: '/api',
//   PROXY_HOST: 'http://localhost',
//   AGENT: null,
// };

// let proxyConfigs = [];

// try {
//   if (fs.existsSync('./.configs/base.json')) {
//     baseConfig = JSON.parse(fs.readFileSync('./.configs/base.json', 'utf8'));
//   }

//   if (MODE === 'IFT' && fs.existsSync('./.configs/ift.json')) {
//     const iftConfig = JSON.parse(fs.readFileSync('./.configs/ift.json', 'utf8'));
//     proxyConfigs = Array.isArray(iftConfig) ? iftConfig : [iftConfig];
//   } else if (fs.existsSync('./.configs/local.json')) {
//     const localConfig = JSON.parse(fs.readFileSync('./.configs/local.json', 'utf8'));
//     proxyConfigs = Array.isArray(localConfig) ? localConfig : [localConfig];
//   }
// } catch (err) {
//   console.error('ошибка при чтении конфиг файлов:', err);
// }

// if (isDev) {
//   console.info('режим:', MODE);
//   proxyConfigs.forEach((config) => {
//     console.info(`Проксирование: ${config.PROXY_API_PREFIX} -> ${config.PROXY_HOST}`);
//   });
// }

// const createAgent = (agentConfig) => {
//   if (!agentConfig) return undefined;

//   try {
//     return new https.Agent({
//       ca1: fs.readFileSync(path.resolve(__dirname, agentConfig.AGENT.CERT_1)),
//       ca2: fs.readFileSync(path.resolve(__dirname, agentConfig.AGENT.CERT_2)),
//       ca3: fs.readFileSync(path.resolve(__dirname, agentConfig.AGENT.CERT_3)),
//       rejectUnauthorized: false,
//     });
//   } catch (err) {
//     console.error('ошибка при настройке агента: ', err);
//     return undefined;
//   }
// };

// const createProxySettings = () => {
//   return proxyConfigs.map((config) => {
//     const proxySetting = {
//       context: [config.PROXY_API_PREFIX],
//       target: config.PROXY_HOST,
//       secure: false,
//       changeOrigin: true,
//       Headers: {
//         'X-Forwarded-Proto': 'https',
//       },
//     };

//     if (config.PATH_REWRITE) {
//       proxySetting.pathRewrite = config.PATH_REWRITE;
//     }

//     if (config.AGENT) {
//       proxySetting.agent = createAgent(config.AGENT);
//     }

//     return proxySetting;
//   });
// };

// const proxySettings = createProxySettings();

// const config: Configuration & { devServer?: DevServerConfiguration } = merge(common, {
//   mode: isDev ? 'development' : 'production',
//   entry: { app: './src/main.tsx' },
//   output: {
//     filename: '[name].[contenthash].js',
//     path: path.resolve(__dirname, 'dist/app'),
//     clean: true,
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: path.resolve(__dirname, 'index.html'),
//     }),
//     new HotModuleReplacementPlugin(),
//     new DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
//       'process.env': JSON.stringify(process.env),
//       'process.env.MODE': JSON.stringify(process.env.MODE),
//       'process.env.PROXY_API_PREFIX': JSON.stringify(process.env.PROXY_API_PREFIX),
//       'process.env.HOST': JSON.stringify(process.env.HOST),
//     }),
//   ],
//   devtool: isDev ? 'inline-source-map' : undefined,
//   devServer: {
//     port: baseConfig.PORT || '3000',
//     host: baseConfig.HOST || 'localhost',
//     open: true,
//     hot: true,
//     historyApiFallback: true,
//     proxy: proxySettings,
//     static: path.resolve(__dirname, baseConfig.OUTPUT_DIR),
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//       name: false,
//     },
//   },
// });

// export default config;
