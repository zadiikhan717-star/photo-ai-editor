export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    const { image } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45b3e7c2a5e6c9d3a5f8b7c2d4e6f8a9b1c3d5e7f9a2b4c6d8e0f1a2b3",
        input: {
          prompt: "cinematic portrait, golden hour light, ultra realistic",
          image: image,
          strength: 0.7
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
