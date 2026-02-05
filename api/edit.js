export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return res.status(500).json({ message: "API token missing" });
    }

    const { image } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45b9c4a5f3b2f9c8d7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7",
        input: {
          image: image,
          prompt: "cinematic portrait, golden hour light, ultra realistic, sharp details"
        }
      })
    });

    const data = await response.json();
    return res.status(200).json({ id: data.id });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
