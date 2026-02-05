export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    const { image } = req.body;

    const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "db21e45b5c3a3c3f8d9e9b9a7f6e7c8b9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
          input: {
            image: image,
            prompt: "cinematic portrait, golden hour light, ultra realistic"
          }
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
