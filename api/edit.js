export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    const { image, preset } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "7762fd07",
        input: {
          image: image,
          prompt: preset + " cinematic photo, ultra realistic, high detail"
        }
      })
    });

    let prediction = await response.json();

    // ⏳ Wait until image is ready
    while (prediction.status !== "succeeded") {
      await new Promise(r => setTimeout(r, 1500));
      const check = await fetch(prediction.urls.get, {
        headers: { Authorization: `Token ${token}` }
      });
      prediction = await check.json();
    }

    // ✅ Send ONLY image URL to frontend
    return res.status(200).json({
      image: prediction.output[0]
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
