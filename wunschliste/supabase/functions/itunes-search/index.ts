Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const term = (url.searchParams.get("term") || "").trim();

    if (!term) {
      return new Response(JSON.stringify({ resultCount: 0, results: [] }), {
        headers: corsHeaders
      });
    }

    const params = new URLSearchParams({
      term,
      media: "music",
      entity: "song",
      limit: "25",
      country: "DE",
      lang: "de_de",
      explicit: "Yes"
    });

    const appleUrl = "https://itunes.apple.com/search?" + params.toString();

    const appleRes = await fetch(appleUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "ForeverfuchsWedding/1.0"
      }
    });

    if (!appleRes.ok) {
      return new Response(JSON.stringify({
        error: "iTunes Fehler",
        status: appleRes.status,
        resultCount: 0,
        results: []
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    const data = await appleRes.json();

    return new Response(JSON.stringify(data), {
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      resultCount: 0,
      results: []
    }), {
      status: 200,
      headers: corsHeaders
    });
  }
});
