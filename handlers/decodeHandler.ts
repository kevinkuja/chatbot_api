import { Request, Response } from 'express';
import { process } from '../helpers/openaiHelper.js';
import { generateTxs } from '../helpers/actions.js';
import { getChainId } from '../config/chains.js';

export const decodeHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { texts, caller } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        status: 'error',
        message: "Request body must include 'texts' as an array of strings",
      });
    }

    const result = await process(texts);
    const txs = await generateTxs(caller, result);

    return res.json({
      status: 'success',
      data: {
        parsed: result,
        transactions: txs,
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
