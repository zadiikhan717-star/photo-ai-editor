export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    const { image } = req.body;

    const response = await fetch(
      "https://api.replicate.com/v1/models/stability-ai/stable-diffusion/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt: "cinematic portrait, golden hour light, ultra realistic",
            image: image,
            strength: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
