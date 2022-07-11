import { window } from "coc.nvim";

export enum LogLevel {
    Info = 0,
    Warn,
    Err
}

export const LOG = (level: LogLevel, message: string) => {
    switch (level) {
        case LogLevel.Info: {
            console.log(`coc-cord-reborn: ${message}`);
            break;
        }
        case LogLevel.Warn: {
            console.warn(`coc-cord-reborn: ${message}`);
            break;
        }
        case LogLevel.Err: {
            console.error(`coc-cord-reborn: ${message}`);
            break;
        }
        default: {
            console.log(`coc-cord-reborn: ${message}`);
            break;
        }
    }
};
