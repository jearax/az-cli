import { styleText } from 'node:util';

import { PACKAGE } from '@/core/constants/package.constant';
import { examplesText } from '@/core/ui/help-examples.ui';

import { runHello } from './services/hello.service';

import type { HelloOptions } from './services/hello.service';
import type { Command } from 'commander';

export const registerHelloCommand = (program: Command): void => {
	program
		.command('hello')
		.description('Print a greeting')
		.option('--name <name>', 'Who to greet', 'world')
		.addHelpText(
			'after',
			examplesText([
				[`${PACKAGE.name} hello`, 'Greet the world'],
				[`${PACKAGE.name} hello --name Ada`, 'Greet Ada']
			])
		)
		.action((options: HelloOptions) => {
			const result = runHello(options);

			process.stdout.write(`${styleText('green', result.greeting, { stream: process.stdout })}\n`);
		});
};
