const {
    session,
    Telegraf,
} = require("telegraf");
const axios = require("axios");
const { updateOne, findOne } = require("../crud/mongoCrud");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

class TelegramBot {
    constructor() {
        this.bot = new Telegraf(token);

        this.bot.use(session());
        // internal bot functions
        this.initInternalFunctions();
        // command to add chat to mongo
        this.initBotCommands();
        // dont send any message
        this.bot.use(() => null);
    }

    initInternalFunctions() {
        this.bot.context.tf = {
            insertToMongo: async (chatInfo) => {
                const {
                    id, title, type, description,
                } = chatInfo;

                await updateOne(
                    "Groups",
                    { id },
                    {
                        $set: {
                            id,
                            title,
                            type,
                            description,
                        },
                    },
                    {
                        upsert: true,
                    },
                );

                console.log("updated group: ", {
                    id,
                    title,
                    type,
                    description,
                });
            },
            findChatByTitle: async (title) => {
                const chat = await findOne("Groups", { title }, {});
                console.log(chat, title);
                return chat.id;
            },
        };
    }

    initBotCommands() {
        this.bot.command(
            "run", async (ctx) => {
                // dont add private to chat
                if (ctx.chat.type === "private") return null;
                try {
                    const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`);

                    for (const item of response.data.result) {
                        const chatInfo = await ctx.getChat(item.message.chat.id);

                        await this.insertToMongo(chatInfo);
                    }

                    return ctx.reply("telegram chat added");
                } catch (e) {
                    console.log(e);

                    return ctx.reply("can't add chat");
                }
            },
        );
    }

    async insertToMongo(chatInfo) {
        await this.bot.context.tf.insertToMongo(chatInfo);
    }

    async findChatByTitle(title) {
        return this.bot.context.tf.findChatByTitle(title);
    }

    async sendRawMessage({ tags, text }) {
        const chatId = await this.findChatByTitle(tags);

        await this.bot.telegram.sendMessage(chatId, text);

        console.log(`message send to group: ${tags} with text: ${text}`);
    }

    async sendWithAttachments() { console.log(this.bot); }

    async prepareMessage(args) {
        if (args.hasOwnProperty("photos") && args.photos && args.photos.length > 0) {
            await this.sendWithAttachments(args);
        } else {
            await this.sendRawMessage(args);
        }
    }

    async handleMessage({ topic, message }) {
        if (topic !== "send-telegram") return;

        const value = message.value.toString();
        const parsedValue = JSON.parse(value);

        console.log({
            topic,
            parsedValue,
        });

        await this.prepareMessage(parsedValue);
    }
}

module.exports = {
    TelegramBot,
};
