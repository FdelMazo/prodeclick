import { getParty, initParty } from "../../../logic/db";

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const { id } = request.query;
        const party = await getParty(id);
        return response.status(200).json(party);
    } else if (request.method === 'PUT') {
        const { id } = request.query;
        const body = JSON.parse(request.body)
        const { name, adminUserId } = body;
        await initParty(id, name, adminUserId);
        return response.status(200).json({ ok: true });
    }
}
