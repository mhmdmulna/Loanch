import "dotenv/config";
import { readFile } from "node:fs/promises";
import { Contract, JsonRpcProvider, parseEther } from "ethers";

const provider = new JsonRpcProvider(process.env.VITE_BOT_CHAIN_RPC_URL);
const network = await provider.getNetwork();
if (network.chainId !== 31337n) throw new Error("Local smoke test requires chain ID 31337.");

const abi = JSON.parse(await readFile("./contracts/abi/LoanchPool.json", "utf8"));
const signer = await provider.getSigner(1);
const user = await signer.getAddress();
const pool = new Contract(process.env.VITE_LOANCH_CONTRACT_ADDRESS, abi, signer);
const amount = parseEther("1");
const before = await pool.getSaverPosition(user);
if (await pool.identityVerified(user)) throw new Error("Smoke account unexpectedly has verified identity metadata.");
await (await pool.deposit({ value: amount })).wait();
const after = await pool.getSaverPosition(user);
const profile = await pool.getBorrowerProfile(user);
if (after.shares <= before.shares || profile.reputation !== 50n) {
  throw new Error("Demo identity bypass smoke test failed.");
}

console.log(JSON.stringify({ chainId: network.chainId.toString(), identityVerified: false, deposited: "1" }));
