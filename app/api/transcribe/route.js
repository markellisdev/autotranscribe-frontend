export async function POST(req) {
    const { rss } = await req.json();
  
    try {
      const response = await fetch("http://localhost:8000/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rss }),
      });
  
      const text = await response.text();
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        return Response.json({ error: "Invalid JSON returned from backend." }, { status: 500 });
      }
  
      if (!response.ok) {
        return Response.json({ error: data.error || "Something went wrong." }, { status: 500 });
      }
  
      return Response.json(data);
    } catch (err) {
      return Response.json({ error: "Network error. Please try again." }, { status: 500 });
    }
    // Return dummy result TESTING ONLY
    // return Response.json({
    //     transcriptUrl: `/transcripts/fake-transcript.txt`,
    // });
  }