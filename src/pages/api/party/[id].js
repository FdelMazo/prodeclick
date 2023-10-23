import { deleteParty, getParty, updateParty } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "GET") {
    const { id, notfull } = request.query;
    const party = await getParty(id, !notfull);
    if (!party) {
      return response.status(404).json({ error: "Party not found" });
    }
    return response.status(200).json(party);
  } else if (request.method === "PUT") {
    const { id } = request.query;
    const body = JSON.parse(request.body);
    await updateParty(id, body);
    return response.status(200).json({ ok: true });
  } else if (request.method === "DELETE") {
    const { id } = request.query;
    await deleteParty(id);
    return response.status(200).json({ ok: true });
  }
}
