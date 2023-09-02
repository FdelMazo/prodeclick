import { getParty } from "../../../logic/db";

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const { id } = request.query;
        const party = await getParty(id);
        return response.status(200).json(party);
    }
}
