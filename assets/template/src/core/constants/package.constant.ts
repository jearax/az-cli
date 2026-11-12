export type PackageInfo = {
	/** The bin key in package.json, not the npm package name. */
	name: string;
	description: string;
	version: string;
	nodeFloor: string;
};

/** Injected by tsdown (`define`), from `scripts/package-info.mjs`. */
declare const your_define_constant: PackageInfo;

export const PACKAGE = your_define_constant;
