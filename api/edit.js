export default async function handler(req, res) {
  try {
    const { image, preset } = req.body;

    const prompts = {
      cinematic:
        "cinematic portrait, dramatic lighting, ultra realistic, sharp details",
      golden:
        "golden hour light, warm tones, soft shadows, realistic skin texture",
      restore:
        "restore old photo, remove noise, enhance details, ultra clear",
      moody:
        "dark moody lighting, high contrast, deep shadows, cinematic look",
    };

    const prompt = prompts[preset] || prompts.cinematic;

    // 1) Start prediction
    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07", // SDXL latest
        input: {
          prompt,
          image,
        },
      }),
    });

    const prediction = await start.json();

    if (!prediction?.urls?.get) {
      return res.status(500).json({ error: prediction });
    }

    // 2) Poll until done
    let result = prediction;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed"
    ) {
      await new Promise((r) => setTimeout(r, 1500));

      const check = await fetch(result.urls.get, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      result = await check.json();
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: result.error });
    }

    // 3) Send image back
    return res.status(200).json({
      image: result.output[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
