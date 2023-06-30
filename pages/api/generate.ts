
export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };
  if (!process.env.OPENAI_API_KEY) {
    return new Response("No api key found", { status: 400 });
  }


  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }


  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: "user", content: generatePrompt(prompt) }],
    temperature: 0.7,
    max_tokens: 300,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const data = completion.body;
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    });
  } catch (e) {
    console.log(e);
    return new Response("Failed to build", { status: 500 });
  }
};

function generatePrompt(prompt: string) {
  return `Create a LinkedIn carousel on the topic: '${prompt}'. The carousel will consist of 5 slides.
  1. The first slide will have the topic title only.
  2. Slides 2 to 4 will each contain a short title and a piece of content. The content should be a maximum of 2-3 sentences long. Separate title and content with keyword 'SlideNext'.
  3. The final slide, Slide 5, will be a Call to Action (CTA) with title only.
  4. Every slide should begin with keyword 'Slide {number}' and end with keyword 'EndSlide'. For example, 'Slide 1: Title. EndSlide Slide 2: Title SlideNext Content EndSlide'.`
}

export default handler;
