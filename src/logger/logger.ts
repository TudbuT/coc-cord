import { window } from "coc.nvim";

export enum LogLevel {
	Info = 0,
	Warn,
	Err
}

export const LOG = (level: LogLevel, message: string) => {
	switch (level) {
		case LogLevel.Info: {
			window.showMessage(`coc-cord: ${message}`, "more");
		}
		case LogLevel.Warn: {
			window.showMessage(`coc-cord: ${message}`, "warning");
		}
		case LogLevel.Err: {
			window.showMessage(`coc-cord: ${message}`, "error");
		}
		default: {
			window.showMessage(`coc-cord: ${message}`, undefined);
		}
	}
};
