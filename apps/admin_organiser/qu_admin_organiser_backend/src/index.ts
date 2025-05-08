// Guest Backend API
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { connect } from '@coderbois-2-0/message-broker';
import {
    createEventQueue
} from '@coderbois-2-0/message-broker';

const app = new Hono();
const PORT = parseInt(process.env.PORT || '3000');
const RABBITMQ_URL =
    process.env.RABBITMQ_URL || 'amqp://message-broker-exposer:5672';

let eventPublisher: (msg: string) => void;

// simple root endpoint that says hello from Admnin Organiser backend
app.get('/', (c) => c.text('Hello from the Admin Organiser Backend!'));
async function setupRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ at', RABBITMQ_URL);
        const connection = await connect(RABBITMQ_URL);
        console.log('Connected to RabbitMQ');

        // Set up publisher for sending Admin data to Guest Synchronizer
        eventPublisher = await createEventQueue.createPublisher(connection);

        console.log('RabbitMQ setup complete in Guest Backend');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(setupRabbitMQ, 5000);
    }
}

setupRabbitMQ();

app.post('/create-event', async (c) => {
    try {
        const eventData = await c.req.json();
        const message = JSON.stringify(eventData);

        if (eventPublisher) {
            eventPublisher(message);
            console.log('Published event data to RabbitMQ:', message);
            return c.json({
                success: true,
                message: 'Event data sent to Guest Synchronizer',
            });
        } else {
            return c.json(
                { success: false, message: 'RabbitMQ not connected' },
                503
            );
        }
    } catch (error) {
        console.error('Error submitting event data:', error);
        return c.json(
            { success: false, message: 'Failed to submit event data' },
            500
        );
    }
});

console.log(`Admin Organiser API running on port ${PORT}`);
await setupRabbitMQ();
serve({
    fetch: app.fetch,
    port: PORT,
});
