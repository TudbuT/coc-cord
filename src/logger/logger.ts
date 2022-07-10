import { window } from "coc.nvim";

export enum LogLevel {
	Info = 0,
	Warn,
	Err
}

export const LOG = (level: LogLevel, message: string) => {
	switch (level) {
		case LogLevel.Info: {
			window.showMessage(`coc-cord-reborn: ${message}`, "more");
		}
		case LogLevel.Warn: {
			window.showMessage(`coc-cord-reborn: ${message}`, "warning");
		}
		case LogLevel.Err: {
			window.showMessage(`coc-cord-reborn: ${message}`, "error");
		}
		default: {
			window.showMessage(`coc-cord-reborn: ${message}`, undefined);
		}
	}
};
