import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { usersHandler } from './db/index.js';

const app = new Hono();

app.get('/', (c) => {
    return c.json({ data: 'Hello from authenticator' });
});

app.get('/users', async (c) => {
    const users = await usersHandler.getUsers();

    return c.json({ data: users });
});

app.get('/users/:username', async (c) => {
    const userUsername = c.req.param('username');
    const user = await usersHandler.findUser(userUsername);

    return c.json({ data: user });
});

app.post('/users', async (c) => {
    const user = usersHandler.createUser({
        username: 'Foo',
        email: 'foo@example.com',
        password: 'foo',
        role: 'GUEST',
    });

    return c.json({ data: user });
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);
