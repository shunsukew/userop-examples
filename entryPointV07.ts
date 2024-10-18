import { createSmartAccountClient } from "permissionless"
import { toSimpleSmartAccount } from "permissionless/accounts"
import { createPublicClient, getContract, http, parseEther, Hex } from "viem"
import { entryPoint07Address, entryPoint06Address } from "viem/account-abstraction"
import { privateKeyToAccount } from "viem/accounts"
import { soneiumMinato } from "viem/chains"

const factoryAddress = "0x";

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

const txHash = await smartAccountClient.sendTransaction({
	to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
	value: 0n,
	data: "0x1234",
})
 
console.log(`User operation included: https://explorer-testnet.soneium.org/tx/${txHash}`)
