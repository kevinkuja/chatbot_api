import { encodeFunctionData, parseAbi, parseUnits } from 'viem';
import { TOKENS, NATIVE } from '../config/tokens.js';

const erc20Abi = ['function transfer(address, uint256)'];
export const generateTx = (chain, result) => {
  switch (result.action) {
    case 'transfer':
      return generateTransferTx(chain, result);
    default:
      return null;
  }
};

const generateTransferTx = async (chain, result) => {
  switch (chain) {
    case 'polkadot':
      return generatePolkadotTransferTx(chain, result);
    case 'stellar':
      return generateStellarTransferTx(chain, result);
    default:
      return generateEVMTransferTx(chain, result);
  }
};
const generateEVMTransferTx = async (chain, result) => {
  const token = getTokenAddress(chain, result.token);
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to, amount],
  });

  return {
    to: token.address,
    value: token.address === NATIVE ? amount : 0,
    data: tx,
  };
};

const getTokenAddress = (chain, token) => {
  return TOKENS[chain][token.toUpperCase()];
};
