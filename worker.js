const {
    session,
    Telegraf,
} = require("telegraf");
const axios = require("axios");
const { updateOne, findOne } = require("./crud/mongoCrud");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

async function telegramAPI() {
    const bot = new Telegraf(token);
    bot.use(session());

    // internal bot functions
    bot.context.tf = {
        insertToMongo: async (chatInfo) => {
            const {
                id, title, type, description,
            } = chatInfo;

            await updateOne(
                "Groups",
                {
                    id: id,
                },
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
            return chat.id;
        },
    };

    // command to add chat to mongo
    bot.command(
        "run", async (ctx) => {
            // dont add private to chat
            if (ctx.chat.type === "private") return null;

            try {
                const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`);

                for (const item of response.data.result) {
                    const chatInfo = await ctx.getChat(item.message.chat.id);
                    const {
                        id, title, type, description,
                    } = chatInfo;

                    await updateOne(
                        "Groups",
                        {
                            id: id,
                        },
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
                }

                return ctx.reply("telegram chat added");
            } catch (e) {
                console.log(e);

                return ctx.reply("can't add chat");
            }
        },
    );

    // try {
    //     const id = await bot.context.tf.findChatByTitle("test_group_wbs_2");
    //
    //     await bot.telegram.sendMessage(id, "kekl");
    // } catch (e) {
    //     console.log(e);
    // }

    bot.use(() => null);

    await bot.launch();

    return bot;
}

module.exports = {
    telegramAPI,
};
