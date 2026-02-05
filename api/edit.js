export default async function handler(req, res) {
  const token = process.env.REPLICATE_API_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Missing API token" });
  }

  res.status(200).json({
    message: "API connected successfully",
  });
}
