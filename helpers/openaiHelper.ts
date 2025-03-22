import openai from '../config/openai.js';
import { TransactionResult } from '../types';

export const processTextsWithAI = async (texts: string[]): Promise<TransactionResult> => {
  if (!texts || !Array.isArray(texts)) {
    throw new Error('Texts must be provided as an array of strings');
  }

  const prompt = `
  Interpret the following text and extract the following fields in JSON format:
  - action: should be one of ["transfer"]. If no valid action is found, return an error.
  - amount: the numeric value being transferred or swapped.
  - token: the currency/token being used.
  - to: the recipient address or destination.
  - chain: the chain of the transaction [ethereum, base, zksync, mantle, stellar, polkadot, worldchain].
  
  Only return the JSON, nothing else. Without any other text or comments.
  In the "description" field, return a description of the transaction, describing deeply the future transaction.
  In the "message" field, return a message to the user, describing the transaction.

  Text: ${texts.join('\n')}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }
  return JSON.parse(content) as TransactionResult;
};
