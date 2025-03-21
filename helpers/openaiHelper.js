import openai from "../config/openai.js";

export const processTextsWithAI = async (texts) => {
  if (!texts || !Array.isArray(texts)) {
    throw new Error("Texts must be provided as an array of strings");
  }

  const prompt = `
  Interpret the following text and extract the following fields in JSON format:
  - action: should be one of ["transfer"]. If no valid action is found, return an error.
  - amount: the numeric value being transferred or swapped.
  - token: the currency/token being used.
  - to: the recipient address or destination.

  Only return the JSON, nothing else. Without any other text or comments.

  Text: ${texts.join("\n")}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {"role": "user", "content": prompt},
    ],
  });

  const content = completion.choices[0].message.content;
  return JSON.parse(content);
}; 