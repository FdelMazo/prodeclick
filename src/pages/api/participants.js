import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const userKeys = (await kv.scan(0, { prefix: 'user:' }))[1]
        const users = await Promise.all(userKeys.map(async userKey => {
            const userData = await kv.hgetall(userKey);
            return {
                uuid: userKey.split(':')[1],
                ...userData
            };
        }))
        return response.status(200).json(users);
    } else if (request.method === 'POST') {
        const requestBody = JSON.parse(request.body);
        const user = await kv.hset('user:me', requestBody);
        return response.status(201).json(user);
    } else if (request.method === 'PUT') {
        const requestBody = JSON.parse(request.body);
        const user = await kv.hset('user:me', requestBody);
        return response.status(204).json(user);
    }
}
