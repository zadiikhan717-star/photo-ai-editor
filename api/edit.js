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
        version: "sdxl",
        input: {
          image: image,
          prompt: "cinematic portrait, golden hour lighting, ultra realistic, sharp details"
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
