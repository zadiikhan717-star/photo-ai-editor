export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { image } = await req.json();
  const token = process.env.REPLICATE_API_TOKEN;

  const start = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "7762fd07",
      input: {
        prompt: "cinematic portrait, golden hour light, ultra realistic",
        image: image
      }
    })
  });

  const prediction = await start.json();

  let result;
  while (true) {
    await new Promise(r => setTimeout(r, 2000));

    const check = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      { headers: { "Authorization": `Token ${token}` } }
    );

    result = await check.json();

    if (result.status === "succeeded") break;
  }

  return new Response(
    JSON.stringify({ image: result.output[0] }),
    { headers: { "Content-Type": "application/json" } }
  );
}
