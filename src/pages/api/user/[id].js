import { getUser, updateUserProde } from "../../../logic/db";

export default async function handler(request, response) {
  if (request.method === "GET") {
    const { id } = request.query;
    const user = await getUser(id);
    return response.status(200).json(user);
  } else if (request.method === "PUT") {
    const { id } = request.query;
    const body = JSON.parse(request.body);
    const { prode } = body;
    const user = await updateUserProde(id, prode);
    return response.status(200).json(user);
  }
}
