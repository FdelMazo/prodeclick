import { getUser } from "../../../logic/db";

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const { id } = request.query;
        const user = await getUser(id);
        return response.status(200).json(user);
    }
}
