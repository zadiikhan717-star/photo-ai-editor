export default async function handler(req, res) {
  try {
    const { image, preset } = req.body;

    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07",   // SDXL latest
        input: {
          image: image,
          prompt: `${preset} cinematic portrait, golden hour light, ultra realistic, sharp details`,
        },
      }),
    });

    const prediction = await start.json();

    // ⏳ WAIT LOOP (correct one)
    let result;
    while (true) {
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

      if (result.status === "succeeded") break;
      if (result.status === "failed") {
        return res.status(500).json({ error: "AI processing failed" });
      }
    }

    return res.status(200).json({
      image: result.output[0],
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
          }
