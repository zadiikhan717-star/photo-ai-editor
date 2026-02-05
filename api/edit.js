export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing API token" });
    }

    const { image } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "9283609d5e2f61c4c1e54e3a7c6f6c8f5b3e3b6b4b7c9a2e1d6f8b2a3c4d5e6f",
        input: {
          img: image
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
