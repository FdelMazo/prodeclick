import { getParty, updateParty } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "GET") {
    const { id } = request.query;
    const party = await getParty(id);
    return response.status(200).json(party);
  } else if (request.method === "PUT") {
    const { id } = request.query;
    const { name, admin } = JSON.parse(request.body);
    await updateParty(id, name, admin);
    return response.status(200).json({ ok: true });
  }
}
