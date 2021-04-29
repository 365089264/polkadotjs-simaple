// Import
import { ApiPromise, WsProvider } from '@polkadot/api';


// Construct
const wsProvider = new WsProvider('ws://8.210.86.149:9944');
const api = await ApiPromise.create({ provider: wsProvider });

// Do something
console.log(api.genesisHash.toHex());

async function main () {

  // Retrieve the current block header
  const lastHdr = await api.rpc.chain.getHeader();
  const ADDR="15wWqoxfoBKeC56F9SL1dJCNq88rwDGwAtKJmYim1tP3g9Rr"
  // Retrieve the balance at both the current and the parent hashes
  const [{ data: balanceNow }, { data: balancePrev }] = await Promise.all([
    api.query.system.account.at(lastHdr.hash, ADDR),
    api.query.system.account.at(lastHdr.parentHash, ADDR)
  ]);
  
  // Display the difference
  console.log(`The delta was ${balanceNow.free.sub(balancePrev.free)}`);
}

main().catch(console.error);
