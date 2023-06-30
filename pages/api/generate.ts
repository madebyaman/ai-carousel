import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { prompt, template } = req.body as {
    prompt?: string;
    template?: string[];
  };


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
    return res.status(200).json(data)
  } catch (e) {
    console.log(e);
    return res.status(500)
  }
};

function generatePrompt(prompt: string, template: string[]) {
  return `Generate a LinkedIn carousel content for this prompt: ${prompt}. It should follow this example template: ${template}. Each slide should start with 'Slide {number}' and end with 'EndSlide'. If there are multiple text elements in a slide, separate them with 'SlideNext'. Keep same number of slides as the template with same number of text elements. Some slides may only have title and no content or vice-versa follow that structure.

  For example:
  prompt: "3 ways to build an email list"
  template: "Slide 1: Title SlideNext EndSlide, Slide 2:  Slide 1 text SlideNext EndSlide, Slide 3: Slide 2 text SlideNext EndSlide, Slide 4: text SlideNext EndSlide, Slide 5: ending text SlideNext EndSlide"
  `

}

export default handler;
