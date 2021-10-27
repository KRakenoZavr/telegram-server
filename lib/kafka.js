const { Kafka } = require("kafkajs");
require("dotenv").config();

const {
    KAFKA_BROKERS,
    KAFKA_CLIENT_ID,
    KAFKA_USERNAME,
    KAFKA_PASSWORD,
    KAFKA_CONSUMER,
} = process.env;

const config = {
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS.split(","),
    sasl: {
        mechanism: "plain", // scram-sha-256 or scram-sha-512
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
    },
};

const state = {
    consumer: null,
};

async function connectKafka() {
    const kafka = new Kafka(config);
    // If you specify the same group id and run this process multiple times, KafkaJS
    // won't get the events. That's because Kafka assumes that, if you specify a
    // group id, a consumer in that group id should only read each message at most once.
    state.consumer = kafka.consumer({ groupId: KAFKA_CONSUMER });

    await state.consumer.connect();

    await state.consumer.subscribe({ topic: "send-telegram", fromBeginning: true });
}

const getConsumer = () => state.consumer;

module.exports = {
    connectKafka,
    getConsumer,
};
