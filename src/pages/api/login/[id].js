import { checkUser } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "PUT") {
    const { id: partyId } = request.query;
    const { name, password } = JSON.parse(request.body);
    const { userId, create, wrongPassword } = await checkUser(
      partyId,
      name,
      password
    );

    if (create) {
      return response.status(404).json({ create });
    } else if (wrongPassword) {
      return response.status(403).json({ wrongPassword });
    } else {
      return response.status(200).json({ userId });
    }
  }
}
