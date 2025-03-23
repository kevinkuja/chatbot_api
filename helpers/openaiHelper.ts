import openai from '../config/openai.js';
import { TransactionResult } from '../types';

export const processTextsWithAI = async (texts: string[]): Promise<TransactionResult> => {
  if (!texts || !Array.isArray(texts)) {
    throw new Error('Texts must be provided as an array of strings');
  }

  const prompt = `
  Interpret the following text and extract the following fields in JSON format:
  - action: should be one of ["transfer", "invest", "swap"]. If no valid action is found, return an error.
  - amount: the numeric value being transferred, swapped or invested.
  - token: the currency/token being used.
  - chain: the chain of the transaction [ethereum, base, zksync, mantle, stellar, polkadot, worldchain].

  If transfer, extract the following fields:
  - to: the recipient address or destination.

  If invest, extract the following fields:
  - to: the recipient of the investment, one of ['aave', 'lendle'].
  
  If swap, extract the following fields:
  - tokenFrom: the token being sold.
  - tokenTo: the token being bought.

  Only return the JSON, nothing else. Without any other text or comments.
  In the "description" field, return a description of the transaction, describing deeply the future transaction.
  In the "message" field, return a message to the user, describing the transaction.

  Current text: ${texts[texts.length - 1]}
  
  Previous texts: ${texts.slice(0, -1).join('\n')} only for context, not for the current text.
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }
  return JSON.parse(cleanJson(content)) as TransactionResult;
};

const cleanJson = (json: string): string => {
  return json.startsWith('json') ? json.slice(4).trim() : json;
};

export const process = async (texts: string[], retries: number = 3): Promise<TransactionResult> => {
  const errors = [];
  for (let i = 0; i < retries; i++) {
    try {
      return await processTextsWithAI(texts);
    } catch (error) {
      console.error(`Error processing text: ${error}`);
      errors.push(error);
    }
  }
  throw new Error(`Failed to process text: ${errors.join(', ')}`);
};
