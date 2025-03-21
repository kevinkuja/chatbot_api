import {  encodeFunctionData, parseAbi, parseUnits } from 'viem';
import { TOKENS } from '../config/tokens.js';

const erc20Abi = ['function transfer(address, uint256)'];
export const generateTx = (chain, result) => {
  switch (result.action) {
    case "transfer":
      return generateTransferTx(chain, result);
    default:
      return null;
  }
};

const generateTransferTx = async (chain, result) => {
  const token = getTokenAddress(chain, result.token);
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to, amount],
  });

  return {
    to: token.address,
    value: 0,
    data: tx,
  };
};

const getTokenAddress = (chain, token) => {
  return TOKENS[chain][token.toUpperCase()];
};
