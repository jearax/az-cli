import { defineCommand, runMain } from 'citty';

import { lsCommand } from '@/commands';
import { displayBanner } from '@/utils/banner';

import { description, name, version } from '../package.json';

// Main CLI entry point — add new subcommands to the subCommands map
const main = defineCommand({
	meta: {
		name,
		version,
		description
	},
	subCommands: {
		ls: lsCommand
		// TODO: register additional commands here, e.g.:
		// init: initCommand,
	},
	run: async () => {
		displayBanner();
		console.log(`Run ${name} --help for available commands.`);
	}
});

runMain(main);
