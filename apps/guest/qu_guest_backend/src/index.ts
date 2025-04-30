// Guest Backend API
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { connect } from '@coderbois-2-0/message-broker';
import { createGuestQueue } from '@coderbois-2-0/message-broker';

const app = new Hono();
const PORT = parseInt(process.env.PORT || '3000');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://message-broker-exposer:5672';

let guestPublisher: (msg: string) => void;

// simple root endpoint that says hello from guest backend
app.get('/', (c) => c.text('Hello from Guest Backend!'));
async function setupRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ at', RABBITMQ_URL);
        const connection = await connect(RABBITMQ_URL);
        console.log('Connected to RabbitMQ');

        // Set up publisher for sending guest data to Admin Synchronizer
        guestPublisher = await createGuestQueue.createPublisher(connection);

        console.log('RabbitMQ setup complete in Guest Backend');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(setupRabbitMQ, 5000);
    }
}

setupRabbitMQ();

/**
 * @openapi
 * /submit-guest:
 *   post:
 *     description: Submit guest data to the Admin Synchronizer
 *     responses:
 *       200:
 *         description: Success
 *       503:
 *         description: RabbitMQ not connected
 *       500:
 *         description: Failed to submit guest data
 */
app.post('/submit-guest', async (c) => {
    try {
        const guestData = await c.req.json();
        const message = JSON.stringify(guestData);

        if (guestPublisher) {
            guestPublisher(message);
            console.log('Published guest data to RabbitMQ:', message);
            return c.json({
                success: true,
                message: 'Guest data sent to Admin Synchronizer',
            });
        } else {
            return c.json(
                { success: false, message: 'RabbitMQ not connected' },
                503
            );
        }
    } catch (error) {
        console.error('Error submitting guest data:', error);
        return c.json(
            { success: false, message: 'Failed to submit guest data' },
            500
        );
    }
});

app.post('/test', async (c) => {
    try {
        // Read request body as text instead of JSON
        const testString = await c.req.text();

        if (guestPublisher) {
            // Publish the raw string to RabbitMQ
            guestPublisher(testString);
            console.log('Published test string to RabbitMQ:', testString);
            return c.json({
                success: true,
                message: 'Test string sent to Admin Synchronizer',
                content: testString,
            });
        } else {
            return c.json(
                { success: false, message: 'RabbitMQ not connected' },
                503
            );
        }
    } catch (error) {
        console.error('Error processing test string:', error);
        return c.json(
            { success: false, message: 'Failed to process test string' },
            500
        );
    }
});

console.log(`Guest Backend API running on port ${PORT}`);
await setupRabbitMQ();
serve({
    fetch: app.fetch,
    port: PORT,
});
