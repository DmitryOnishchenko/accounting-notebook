import packageJson from '../../package.json';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.title = `node-${packageJson.name}-v${packageJson.version}-${process.env.NODE_ENV}`;

import { start } from './Server';
start();
