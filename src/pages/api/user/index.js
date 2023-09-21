import { createUser } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "POST") {
    const { partyId, ...rest } = JSON.parse(request.body);
    const userId = await createUser(partyId, rest);
    return response.status(201).json({ userId });
  }
}
