/*
 * Ruffle type configuration
 * Based on the options listed in the Ruffle docs
 * https://ruffle.rs/js-docs/master/interfaces/BaseLoadOptions.html
 */

import type { BaseLoadOptions } from "@ruffle/public/config";
import type { PublicAPI, PublicAPILike } from "@ruffle/public/setup";

export type RuffleConfig = BaseLoadOptions;

export interface RuffleProps extends React.ObjectHTMLAttributes<HTMLObjectElement> {
	src: string;
	config?: RuffleConfig;
	children?: React.ReactNode;
	width?: number;
	height?: number;
}

type Ruffle = React.FC<RuffleProps>

// Extend the Window object to include RufflePlayer
declare global {
	interface Window {
        RufflePlayer?: PublicAPILike | PublicAPI;
	}
}