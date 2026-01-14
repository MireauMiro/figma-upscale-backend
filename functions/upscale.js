exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing image" })
      };
    }

    // scale is received correctly from the plugin, even if unused for now
    const scale = Number(body.scale) || 4;

    // IMPORTANT:
    // For now, we simply return the original image.
    // This confirms:
    // - Netlify function works
    // - Base64 transfer works
    // - Plugin pipeline works
    // - No runtime crashes

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: body.image,
        scaleUsed: scale
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        stack: err.stack
      })
    };
  }
};
