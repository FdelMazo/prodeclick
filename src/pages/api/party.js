import { customAlphabet } from 'nanoid';
import { createParty } from '../../logic/db';

export default async function handler(request, response) {
    if (request.method === 'POST') {
        const partyId = await createParty();
        return response.status(201).json({ partyId });
    }
}
