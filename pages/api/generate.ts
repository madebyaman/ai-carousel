
export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const { prompt, template } = (await req.json()) as {
    prompt?: string;
    template?: string;
  };
  if (!process.env.OPENAI_API_KEY) {
    return new Response("No api key found", { status: 400 });
  }


  if (!prompt || !template) {
    return new Response("No prompt in the request", { status: 400 });
  }


  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: "user", content: generatePrompt(prompt, template) }],
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

function generatePrompt(prompt: string, template: string) {
  return `Create LinkedIn carousel content based on this topic: ${prompt}. Use this example template: ${template}. Start each slide with 'Slide {number}' and end with 'EndSlide'. If a slide has multiple text parts, divide them with 'SlideNext'. Keep the same number of slides as in the template. If a template slide has a title but no content, your output slide should also have no content. If a slide has content but no title, your output slide should have only content. Final slide will be Call to action."
  `
}

export default handler;
