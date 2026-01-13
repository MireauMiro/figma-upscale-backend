import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const imageBase64 = body.image;
    const scale = body.scale || 4;

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const apiRes = await fetch(`https://api.upscale.media/v1/enhance?scale=${scale}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSCALE_API_KEY}`,
        "Content-Type": "application/octet-stream"
      },
      body: imageBuffer
    });

    if (!apiRes.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "Upscale failed" }) };
    }

    const upscaledBuffer = await apiRes.arrayBuffer();
    const upscaledBase64 = Buffer.from(upscaledBuffer).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ image: upscaledBase64 })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
