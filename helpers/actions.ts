import { encodeFunctionData, parseAbi, parseUnits, Address } from 'viem';
import { getTokenAddress, NATIVE } from '../config/tokens.js';
import { getChainId } from '../config/chains.js';
import { TransactionResult, EVMTransaction } from '../types';
import { FARMS, getFarmPoolOrDefault } from '../config/farms.js';
import aavePoolAbi from '../abis/aavePool.js';
import { buildSDK, QuoteRequest } from '@balmy/sdk';

const erc20Abi = [
  'function transfer(address, uint256)',
  'function approve(address, uint256)',
] as const;

export const generateTxs = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  const txs: EVMTransaction[] = [];
  switch (result.action) {
    case 'transfer':
      txs.push(await generateTransferTx(result));
      break;
    case 'invest':
      txs.push(...(await generateInvestTx(caller, result)));
      break;
    case 'swap':
      txs.push(...(await generateSwapTx(caller, result)));
      break;
    default:
      return Promise.resolve([]);
  }
  return txs;
};

const generateSwapTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  switch (result.chain) {
    default:
      return generateEVMSwapTx(caller, result);
  }
};

const generateEVMSwapTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  const sdk = buildSDK({});
  const chain = getChainId(result.chain);
  const tokenFrom = getTokenAddress(chain as number, result.tokenFrom!);
  if (!tokenFrom) {
    throw new Error(`Token ${result.tokenFrom} not found on chain ${chain}`);
  }
  const tokenTo = getTokenAddress(chain as number, result.tokenTo!);
  if (!tokenTo) {
    throw new Error(`Token ${result.tokenTo} not found on chain ${chain}`);
  }
  const amount = parseUnits(result.amount.toString(), tokenFrom.decimals);
  const quoteRequest: QuoteRequest = {
    chainId: chain as number,
    sellToken: tokenFrom.address,
    buyToken: tokenTo.address,
    order: {
      type: 'sell',
      sellAmount: amount,
    },
    slippagePercentage: 0.3,
    takerAddress: caller,
    recipient: caller,
  };
  const quotes = await sdk.quoteService.getAllQuotesWithTxs({
    request: quoteRequest,
    config: {
      timeout: '10s',
    },
  });
  const quote = quotes[0];
  const txs: EVMTransaction[] = [];
  if (tokenFrom.address !== NATIVE) {
    txs.push({
      functionName: 'approve',
      to: tokenFrom.address,
      value: '0',
      data: encodeFunctionData({
        abi: parseAbi(erc20Abi),
        functionName: 'approve',
        args: [quote.tx.to as Address, quote.sellAmount.amount],
      }),
    });
  }
  txs.push({
    functionName: 'swap',
    to: quote.tx.to,
    value: quote.tx.value?.toString() ?? '0',
    data: quote.tx.data,
  });
  return txs;
};
const generateInvestTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  switch (result.chain) {
    default:
      return generateEVMInvestTx(caller, result);
  }
};

const generateEVMInvestTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain as number, result.token);

  if (!token) {
    throw new Error(`Token ${result.token} not found on chain ${chain}`);
  }

  const amount = parseUnits(result.amount.toString(), token.decimals);
  const pool = getFarmPoolOrDefault(chain as number, result.to).pool;
  const txs: EVMTransaction[] = [];

  const approvalTx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'approve',
    args: [pool as Address, amount],
  });
  if (token.address !== NATIVE) {
    txs.push({
      functionName: 'approve',
      to: token.address,
      value: '0',
      data: approvalTx,
    });
  }
  const tx = encodeFunctionData({
    abi: aavePoolAbi,
    functionName: 'deposit',
    args: [token.address as Address, amount, caller as Address, 0],
  });
  txs.push({
    functionName: 'deposit',
    to: pool,
    value: '0',
    data: tx,
  });
  return txs;
};

const generateTransferTx = async (result: TransactionResult): Promise<EVMTransaction> => {
  switch (result.chain) {
    default:
      return generateEVMTransferTx(result);
  }
};

const generateEVMTransferTx = async (result: TransactionResult): Promise<EVMTransaction> => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain as number, result.token);
  if (!token) {
    throw new Error(`Token ${result.token} not found on chain ${chain}`);
  }
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to as Address, amount],
  });

  return {
    functionData: {
      abi: parseAbi(erc20Abi),
      functionName: 'transfer',
      args: [result.to as Address, amount.toString()],
    },
    functionName: 'transfer',
    to: token.address === NATIVE ? result.to : token.address,
    value: token.address === NATIVE ? amount.toString() : '0',
    data: token.address !== NATIVE ? tx : null,
  };
};
