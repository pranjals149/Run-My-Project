#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');
const CFonts = require('cfonts');

CFonts.say('Run-My-Project', {
    font: 'block',
    align: 'center',
    colors: ['cyanBright'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
});

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        } catch (err) {
            throw new Error(`Could not find the file ${name}`);
        }

        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log(chalk.yellowBright('Listening ...'))
            console.log(chalk.blueBright("Starting again ..."))
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);