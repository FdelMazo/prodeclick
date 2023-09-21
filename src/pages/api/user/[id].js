import { deleteUser, updateUser } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "PUT") {
    const { id } = request.query;
    const body = JSON.parse(request.body);
    const user = await updateUser(id, body);
    return response.status(200).json(user);
  } else if (request.method === "DELETE") {
    const { id } = request.query;
    const { partyId } = JSON.parse(request.body);
    await deleteUser(partyId, id);
    return response.status(200).json({ ok: true });
  }
}
