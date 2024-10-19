import { createSmartAccountClient } from "permissionless"
import { toSimpleSmartAccount } from "permissionless/accounts"
import { createPublicClient, http, parseEther, Hex, encodeFunctionData } from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { privateKeyToAccount } from "viem/accounts"
import { soneiumMinato } from "viem/chains"
import * as dotenv from "dotenv"

dotenv.config()

// SimpleAccount Factory Contract Address for EntryPoint v0.7.
const factoryAddress = "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";

const networkUrl = process.env.NETWORK_URL ?? "";
if (networkUrl === "") {
    console.error("NETWORK_RPC_URL is not set")
    process.exit(1)
}

const bundlerUrl = process.env.BUNDLER_URL ?? "";
if (bundlerUrl === "") {
	console.error("BUNDLER_RPC_URL is not set")
	process.exit(1)
}

const privateKey = process.env.PRIVATE_KEY ?? ""
if (privateKey === "") {
    console.error("PRIVATE_KEY is not set")
    process.exit(1)
}

async function main() {
	const publicClient = createPublicClient({
		transport: http(networkUrl),
	})
	 
	const simpleAccount = await toSimpleSmartAccount({
		client: publicClient,
		owner: privateKeyToAccount(privateKey as Hex),
		factoryAddress: factoryAddress,
		entryPoint: {
			address: entryPoint07Address,
			version: "0.7",
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
}

main().catch((err) => console.error("Error:", err));