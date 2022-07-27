import { Client as RPCClient } from "discord-rpc";
import { workspace, commands, ExtensionContext } from "coc.nvim";
import { getPresence } from "../presence/presence";
import { LOG, LogLevel } from "../logger/logger";
import { VERSION } from "../version/version";

export class Client {
    private readonly clientID: string;
    private client?: RPCClient;
    private interval = setInterval(() => {}, 1);

    constructor(clientID: string) {
        this.clientID = clientID;
        this.client = new RPCClient({ transport: "ipc" });
        clearInterval(this.interval);
    }

    public connect = async (ctx?: ExtensionContext) => {
        if (!this.client) {
            this.client = new RPCClient({ transport: "ipc" });
        }
        let reconnectTimeout;
        this.client.login({ clientId: this.clientID }).catch(e => {
            if(!reconnectTimeout) {
                reconnectTimeout = setTimeout(async () => {
                    LOG(LogLevel.Info, "reconnecting due to error");
                    try {
                        this.client.destroy().catch(e => {});
                    } catch(e) {}
                    this.client = null;
                    this.connect(ctx);
                    reconnectTimeout = null;
                }, 5000);
            }
        });
        this.client.on("ready", () => this.ready(ctx))
    };

    public disconnect = async () => {
        clearInterval(this.interval);
        await this.client!.destroy();
        this.client = undefined;
        LOG(LogLevel.Info, "disconnected from Discord gateway");
    };

    private ready = async (ctx?: ExtensionContext) => {
        LOG(LogLevel.Info, "connected to Discord gateway");
        if (ctx) {
            this.registerCommands(ctx);
        }
        this.trackActivity();
    };

    private registerCommands = async (ctx: ExtensionContext) => {
        ctx.subscriptions.push(
            commands.registerCommand("cord.disconnect", () => {
                LOG(LogLevel.Info, "trying to disconnect from Discord gateway");
                this.disconnect();
            })
        );
        ctx.subscriptions.push(
            commands.registerCommand("cord.reconnect", () => {
                LOG(LogLevel.Info, "trying to reconnect to Discord gateway");
                this.connect(ctx);
            })
        );
        ctx.subscriptions.push(
            commands.registerCommand("cord.version", () => {
                LOG(LogLevel.Info, `version ${VERSION}`);
            })
        );
    };

    private trackActivity = async () => {
        const startTimeStamp = new Date();
        this.interval = setInterval(async () => {
            this.client!
                .setActivity(getPresence(startTimeStamp, mode((await workspace.nvim.mode).mode), workspace.root.split("/").pop(), workspace.getDocument((await workspace.document).uri)?.uri.split("/").pop()))
                .catch(e => setTimeout(() => this.connect(), 1000));
        }, 1000);
    };
}

function mode(mode: string) {
    switch(mode) {
        case 'n': 
            return 'Normal';
        case 'c':
            return 'Command';
        case 'i':
            return 'Insert';
        case 'R':
            return 'Replace';
        case 'v':
        case 'V':
        case '':
            return 'Visual';
        case 's':
        case 'S':
        case '':
            return 'Select';
        case 't':
            return 'Terminal';
        case 'r': // Please someone tell me what this is! I couldn't find any resources on it.
            return 'Normal';
        default:
            return mode;
    }
}
