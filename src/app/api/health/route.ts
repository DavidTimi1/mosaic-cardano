import { healthService } from "@/services/backend/health";

export const GET = async (request: Request) => {
  // Only allow requests from Authorized Cron scheduler
  const authHeader = request.headers.get('Authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await healthService.keepAlive();
  return Response.json({ status: "ok", message: "Database pulse verified." });
};