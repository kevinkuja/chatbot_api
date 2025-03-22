import { Request, Response } from 'express';
import { processTextsWithAI } from '../helpers/index.js';
import { generateTx } from '../helpers/actions.js';
import { getChainId } from '../config/chains.js';

export const decodeHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { texts } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        status: 'error',
        message: "Request body must include 'texts' as an array of strings",
      });
    }

    const result = await processTextsWithAI(texts);
    const tx = await generateTx(result);

    return res.json({
      status: 'success',
      data: {
        parsed: result,
        transaction: tx,
        chain: getChainId(result.chain),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
