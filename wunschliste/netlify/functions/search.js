exports.handler = async function (event) {
  const query = event.queryStringParameters?.q || "";

  if (!query.trim()) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Missing query" })
    };
  }

  const url =
    "https://itunes.apple.com/search" +
    `?term=${encodeURIComponent(query)}` +
    "&media=music&entity=song&limit=20&country=DE";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Music search API error: " + response.status);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
