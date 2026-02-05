export default async function handler(req, res) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    const { image, preset } = req.body;

    // STEP 1 — create prediction
    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07",
        input: {
          image: image,
          prompt: preset + " cinematic photo, ultra realistic, high detail"
        },
      }),
    });

    const prediction = await start.json();

    // STEP 2 — keep checking until done
    let result = prediction;

    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 1500));

      const check = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      result = await check.json();
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: "AI processing failed" });
    }

    // STEP 3 — send image to frontend
    return res.status(200).json({
      image: result.output[0],
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
