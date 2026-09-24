import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { Contract, ContractFactory, JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(process.env.VITE_BOT_CHAIN_RPC_URL);
const network = await provider.getNetwork();
if (network.chainId !== 31337n) throw new Error("Local demo deployment requires chain ID 31337.");

const artifact = JSON.parse(
  await readFile("./artifacts/contracts/LoanchPool.sol/LoanchPool.json", "utf8"),
);
const previousPool = new Contract(
  process.env.VITE_LOANCH_CONTRACT_ADDRESS,
  artifact.abi,
  provider,
);
const reserveBps = await previousPool.reserveBps();
const signer = await provider.getSigner(0);
const pool = await new ContractFactory(artifact.abi, artifact.bytecode, signer).deploy(
  reserveBps,
);
await pool.waitForDeployment();
const poolAddress = await pool.getAddress();

for (const path of [".env", "frontend/.env"]) {
  const current = await readFile(path, "utf8");
  const updated = current.replace(
    /^VITE_LOANCH_CONTRACT_ADDRESS=.*$/m,
    `VITE_LOANCH_CONTRACT_ADDRESS=${poolAddress}`,
  );
  await writeFile(path, updated);
}

console.log(JSON.stringify({
  pool: poolAddress,
  asset: "native BOT",
  chainId: network.chainId.toString(),
}));
