const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { image, scale } = JSON.parse(event.body || "{}");
    if (!image) {
      return { statusCode: 400, body: "Missing image" };
    }

    const apiKey = process.env.PIXELBIN_API_KEY;
    const upscaleFactor = scale || 4;

    // 1️⃣ Upload image to Pixelbin
    const uploadRes = await fetch(
      "https://api.pixelbin.io/service/public/assets/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: image,
          fileName: "input.png",
          folder: "figma-upscale",
        }),
      }
    );

    const uploadJson = await uploadRes.json();
    const originalUrl = uploadJson?.url;
    if (!originalUrl) throw new Error("Pixelbin upload failed");

    // 2️⃣ Build upscale.media transform URL
    const upscaledUrl = originalUrl.replace(
      "/original/",
      `/resize/upscale/${upscaleFactor}x/`
    );

    // 3️⃣ Fetch the upscaled image bytes
    const imgRes = await fetch(upscaledUrl);
    const buffer = await imgRes.arrayBuffer();

    // 4️⃣ Return base64 to plugin
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: Buffer.from(buffer).toString("base64"),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
