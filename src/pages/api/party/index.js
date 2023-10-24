import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { createParty } from "../../../logic/db";
import { createid } from "../../../logic/utils";

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export default async function handler(request, response) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return response.status(429).json({ error: "TooManyRequests" });
  }

  if (request.method === "POST") {
    const partyId = createid();
    await createParty(partyId);
    return response.status(201).json({ partyId });
  }
}
