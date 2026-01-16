exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { image, scale } = JSON.parse(event.body || "{}");

    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing image" }),
      };
    }

    // Decode base64 → bytes
    const buffer = Buffer.from(image, "base64");

    // Re-encode bytes → base64 (no changes yet)
    const outBase64 = buffer.toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: outBase64,
        byteLength: buffer.length,
        scaleUsed: scale || 4,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};
