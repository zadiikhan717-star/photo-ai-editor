export default async function handler(req, res) {
  try {
    const { image, preset } = req.body;

    const prompts = {
      cinematic: "cinematic portrait, dramatic lighting, ultra realistic",
      golden: "golden hour light, warm tones, realistic photo",
      restore: "restore old photo, enhance details, realistic",
      moody: "dark moody lighting, high contrast, cinematic"
    };

    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "7762fd07",   // SDXL latest
        input: {
          image: image,
          prompt: prompts[preset]
        }
      })
    });

    const prediction = await start.json();

    let result = prediction;

    // wait until done
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));

      const check = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );

      result = await check.json();
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: "Replicate failed" });
    }

    // ✅ IMPORTANT: always return JSON
    return res.status(200).json({
      output: result.output
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
