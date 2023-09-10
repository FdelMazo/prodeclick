import { checkUser } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "PUT") {
    const { id: partyId } = request.query;
    const { name, password } = JSON.parse(request.body);
    const { userId } = await checkUser(partyId, name, password);
    return userId
      ? response.status(200).json({ userId })
      : response.status(404).json({ ok: false });
  }
}
