import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const openAiResponse = async (
  systemPrompt: string,
  userPrompt: string,
  schema: any
) => {
  const openai = new OpenAI();
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],

    response_format: zodResponseFormat(schema,"roadmap"),
  });
  return completion.choices[0].message.parsed;
};
export default openAiResponse;
