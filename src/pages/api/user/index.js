import { createUser } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "POST") {
    const body = JSON.parse(request.body);
    const userId = await createUser(body.partyId, {
      name: body.name,
      password: body.password,
      prode: body.prode,
    });
    return response.status(201).json({ userId });
  }
}
