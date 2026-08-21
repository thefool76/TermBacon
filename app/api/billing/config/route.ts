export async function GET() { return Response.json({ configured: Boolean(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID), mode: process.env.POLAR_SERVER ?? "sandbox" }); }
