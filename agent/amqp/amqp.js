const amqp = require('amqplib');

const queueInfo = {
    host: 'amqp://localhost',
    queue: 'message_queue',
    severity: 'log',
    exchange: 'direct_logs',
    routingKey: 'server1',
};

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(queueInfo.host);
        channel = await connection.createChannel();

        // Ensure the queue exists
        await channel.assertQueue(queueInfo.queue, {
            durable: false,
        });

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection failed', error);
    }
}


async function sendMessage(message) {
    const messageBuffer = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(queueInfo.queue, messageBuffer);
}

module.exports = { connectRabbitMQ, sendMessage }