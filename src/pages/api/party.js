import { kv } from '@vercel/kv';
import { customAlphabet } from 'nanoid';

const id = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const partyKeys = (await kv.scan(0, { match: 'party:*', count: 10000 }))[1]
        return response.status(200).json(partyKeys.length);
    }
    else if (request.method === 'POST') {
        const requestBody = JSON.parse(request.body);
        const partyId = id();
        await kv.hset(`party:${partyId}`, requestBody);
        return response.status(201).json(partyId);
    } else if (request.method === 'PUT') {
        //     const requestBody = JSON.parse(request.body);
        //     const user = await kv.hset('user:me', requestBody);
        //     return response.status(204).json(user);
    }
}
