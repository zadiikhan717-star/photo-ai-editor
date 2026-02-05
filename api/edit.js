export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return res.status(500).json({ message: "API token missing" });
    }

    return res.status(200).json({
      message: "API connected successfully",
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
