import { CliError } from '@/core/errors/cli.error';

export type HelloOptions = {
	name: string;
};

export type HelloResult = {
	greeting: string;
};

export const runHello = ({ name }: HelloOptions): HelloResult => {
	const trimmed = name.trim();

	if (trimmed === '') {
		throw new CliError('The name is empty', { hint: 'Pass a name, for example: --name Ada' });
	}

	return { greeting: `Hello, ${trimmed}!` };
};
