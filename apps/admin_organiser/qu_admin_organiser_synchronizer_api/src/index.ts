// Admin Organiser Synchronizer API
// This API is responsible for synchronizing data from the guest backend to the admin organiser DB.
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { connect } from '@coderbois-2-0/message-broker';
import { createGuestQueue } from '@coderbois-2-0/message-broker';

const app = new Hono();
const PORT = parseInt(process.env.PORT || '3050'); // Admin Synchronizer port
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://message-broker-exposer:5672';

async function setupRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ at', RABBITMQ_URL);
        const connection = await connect(RABBITMQ_URL);
        console.log('Connected to RabbitMQ');

        // Start consumer for guest data
        await createGuestQueue.startConsumer(connection, async (msg) => {
            if (msg) {
                console.log(
                    'Received message from Guest Backend:',
                    msg.content.toString()
                );
            }
        });

        console.log('Admin Synchronizer is listening for messages...');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(setupRabbitMQ, 5000);
    }
}

setupRabbitMQ();

// API endpoint for health check
app.get('/', (c) => c.text('Admin Synchronizer API'));

console.log(`Admin Synchronizer running on port ${PORT}`);
serve({
    fetch: app.fetch,
    port: PORT,
});
// This will start the server and listen for incoming requests
