
export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  return new Response("Hello", { status: 200 });
}

export default handler;
