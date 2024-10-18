const amqp = require('amqplib');
let channel, connection;

// Connect to RabbitMQ
async function connectRabbitMQ() {
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        // Ensure the queue exists
        await channel.assertQueue('message_queue', {
            durable: false,
        });

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection failed', error);
    }
}

// Consume messages from RabbitMQ and broadcast them via Socket.IO
async function consumeMessagesAndBroadcast(messageCallback) {
    if (channel) {
        while (true) {
            try {
                await channel.consume('message_queue', (msg) => {
                    if (msg !== null) {
                        const receivedMessage = JSON.parse(msg.content.toString());

                        messageCallback(receivedMessage);

                        // Acknowledge the message
                        channel.ack(msg);
                    }
                });
            }
            catch (error) {
                console.error('Failed to consume messages', error);
            }
        }
    }
    else {
        console.error('Channel is not initialized');
    }
}

module.exports = {
    connectRabbitMQ,
    consumeMessagesAndBroadcast
};
