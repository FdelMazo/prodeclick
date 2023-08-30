import { kv } from '@vercel/kv';
import { customAlphabet } from 'nanoid';
const id = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const crypto = require('crypto');

export const create = async (key, value) => {
    const newId = id();
    await kv.hset(`${key}:${newId}`, value);
    return newId;
}

export const getAll = async (key) => {
    return (await kv.scan(0, { match: `${key}:*`, count: 10000 }))[1]
}

export const getAllFull = async (keys) => {
    return Promise.all(keys.map(async k => {
        const data = await kv.hgetall(k);
        return {
            id: k.split(':')[1],
            ...data
        };
    }))
}

export const getN = async (key) => {
    return (await getAll(key)).length
}

export const getFullParty = async (partyId) => {
    const party = await kv.hgetall(`party:${partyId}`);
    const users = await getAllFull(party.users)
    return {
        id: partyId,
        ...party,
        users,
    }
}

export const createUser = async (partyId, values) => {
    const { name, password, prode } = values;
    const hash = crypto.createHash('sha256');
    hash.update(password)
    const hashedPassword = hash.digest('hex');

    const userId = await create('user', { name, password: hashedPassword, prode });
    const users = await kv.hget(`party:${partyId}`, 'users');
    await kv.hset(`party:${partyId}`, { users: [...users, `user:${userId}`] });
    return userId;
}

export const createParty = async (partyId, values) => {
    return create('party', { bounty: 1000, users: [] })
}
