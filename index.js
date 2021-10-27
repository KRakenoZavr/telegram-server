const { connect } = require("./lib/mongo");
const { TelegramBot } = require("./lib/telegramBot");
const { connectKafka, getConsumer } = require("./lib/kafka");

async function main() {
    await connect();
    await connectKafka();

    const tgBot = new TelegramBot();

    await tgBot.bot.launch();

    const consumer = getConsumer();

    await consumer.run({
        eachMessage: tgBot.handleMessage.bind(tgBot),
    });
}

main();
