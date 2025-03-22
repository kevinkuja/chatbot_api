import { processTextsWithAI } from '../helpers/index.js';
import { generateTx } from '../helpers/actions.js';
import { getChainId } from '../config/chains.js';
/**
 * Handler for decoding text using OpenAI API
 * @param {Object} req - Express request object with body containing array of texts to decode
 * @param {Object} res - Express response object
 */
export const decodeHandler = async (req, res) => {
  try {
    const { texts } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        status: 'error',
        message: "Request body must include 'texts' as an array of strings",
      });
    }

    // Process texts with OpenAI helper
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
      message: error.message,
    });
  }
};
