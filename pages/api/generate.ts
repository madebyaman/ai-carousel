if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt, template } = (await req.json()) as {
    prompt?: string;
    template?: string[];
  };


  if (!prompt || !template) {
    return new Response("No prompt in the request", { status: 400 });
  }
  // "Generate 2 Casual twitter biographies with no hashtags and clearly labeled "1." and "2.". nulln      Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: Frontend developer, aspiring indie hacker."

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: "user", content: generatePrompt(prompt, template) }],
    temperature: 0.7,
    max_tokens: 200,
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
    return new Response(
      JSON.stringify(e, null, 2),
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );
  }
};

function generatePrompt(prompt: string, template: string[]) {
  return `Generate a LinkedIn carousel content for this prompt: ${prompt}. It should follow this example template: ${template}. Each slide should start with 'Slide {number}' and end with 'EndSlide'. If there are multiple text elements in a slide, separate them with 'SlideNext'. Number of slides should be same. And text length should be similar to the template.

  For example:
  prompt: "3 ways to build an email list"
  template: "Slide 1: Title SlideNext EndSlide, Slide 2:  Slide 1 text SlideNext EndSlide, Slide 3: Slide 2 text SlideNext EndSlide, Slide 4: text SlideNext EndSlide, Slide 5: ending text SlideNext EndSlide"
  `

}

export default handler;