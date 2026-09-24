import { readFile, mkdir, writeFile } from "node:fs/promises";

const artifact = JSON.parse(await readFile("artifacts/contracts/LoanchPool.sol/LoanchPool.json", "utf8"));
await mkdir("contracts/abi", { recursive: true });
await writeFile("contracts/abi/LoanchPool.json", `${JSON.stringify(artifact.abi, null, 2)}\n`);
await mkdir("frontend/src/contracts", { recursive: true });
await writeFile("frontend/src/contracts/LoanchPool.json", `${JSON.stringify(artifact.abi, null, 2)}\n`);
console.log(`Exported ${artifact.abi.length} ABI entries to contracts/abi/LoanchPool.json`);
