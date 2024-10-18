import { createSmartAccountClient } from "permissionless"
import { toSimpleSmartAccount } from "permissionless/accounts"
import { createPublicClient, http, parseEther, Hex, encodeFunctionData } from "viem"
import { entryPoint06Address } from "viem/account-abstraction"
import { privateKeyToAccount } from "viem/accounts"
import { soneiumMinato } from "viem/chains"

// SimpleAccount Factory Contract Address for EntryPoint v0.6.
const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";

const networkUrl = process.env.NETWORK_RPC_URL ?? "";
if (networkUrl === "") {
    console.error("NETWORK_RPC_URL is not set")
    process.exit(1)
}

const bundlerUrl = process.env.BUNDLER_RPC_URL ?? "";
if (bundlerUrl === "") {
	console.error("BUNDLER_RPC_URL is not set")
	process.exit(1)
}

const privateKey = process.env.PRIVATE_KEY ?? ""
if (privateKey === "") {
    console.error("PRIVATE_KEY is not set")
    process.exit(1)
}

export const publicClient = createPublicClient({
	transport: http(networkUrl),
})
 
const simpleAccount = await toSimpleSmartAccount({
	client: publicClient,
	owner: privateKeyToAccount(privateKey as Hex),
    factoryAddress: factoryAddress,
	entryPoint: {
		address: entryPoint06Address,
		version: "0.6",
	},
})

console.log(`Smart account address: https://explorer-testnet.soneium.org/address/${simpleAccount.address}`)

const smartAccountClient = createSmartAccountClient({
	account: simpleAccount,
	chain: soneiumMinato,
	paymaster: {}, // No Paymaster atm.
	bundlerTransport: http(bundlerUrl),
})

// Counter Contract
const counterContractAddress = "0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8";
const counterAbi = [
	{
	  inputs: [],
	  name: "count",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
  ];
const callData = encodeFunctionData({
	abi: counterAbi,
	functionName: 'count'
})

const txHash = await smartAccountClient.sendTransaction({
	to: counterContractAddress,
	value: 0n,
	data: callData,
})
 
console.log(`User operation included: https://explorer-testnet.soneium.org/tx/${txHash}`)
