const { connectRabbitMQ, consumeMessagesAndBroadcast } = require('./amqp');

module.exports = { connectRabbitMQ, consumeMessagesAndBroadcast };