export default async function handler(req, res) {
  try {
    const token = process.env.HF_TOKEN;
    const { image } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: "cinematic portrait, golden hour light, ultra realistic, sharp details",
          options: { wait_for_model: true },
        }),
      }
    );

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    return res.status(200).json({
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
