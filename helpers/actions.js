import { encodeFunctionData, parseAbi, parseUnits } from 'viem';
import { getTokenAddress, NATIVE } from '../config/tokens.js';
import { getChainId } from '../config/chains.js';

const erc20Abi = ['function transfer(address, uint256)'];
export const generateTx = result => {
  switch (result.action) {
    case 'transfer':
      return generateTransferTx(result);
    default:
      return null;
  }
};

const generateTransferTx = async result => {
  switch (result.chain) {
    case 'polkadot':
      return generatePolkadotTransferTx(result);
    case 'stellar':
      return generateStellarTransferTx(result);
    default:
      return generateEVMTransferTx(result);
  }
};
const generateEVMTransferTx = async result => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain, result.token);
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to, amount],
  });

  return {
    to: token.address,
    value: token.address === NATIVE ? amount.toString() : '0',
    data: token.address !== NATIVE ? tx : null,
  };
};
