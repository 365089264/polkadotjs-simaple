import {ApiPromise,WsProvider} from '@polkadot/api'


async function main () {
    const wsProvider=new WsProvider('ws://8.210.86.149:9944');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    console.log(api.genesisHash.toHex());
    // const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    //     console.log(`Chain is at block: #${header.number}`);
    //     unsubscribe();
    //   });
    let header =await api.rpc.chain.getHeader();
    let blcnumber=header.number.unwrap();
    ///console.log(`max blocknumber is #${blcnumber}`)
    for(let i=134;i<=blcnumber;i++){
        console.log("number:",i)
        let blchash=await (await api.rpc.chain.getBlockHash(i)).toHex();
        //console.log(blchash);
        //let events=await api.query.system.events.at(header.hash.toHex())
        let getblock=await api.rpc.chain.getBlock(blchash);
        if (getblock && !getblock.isEmpty){
            let ex=getblock.block.extrinsics;
            for (let j=0; j<ex.length;j++){
                // console.log(ex[j].method.method)
                // console.log(ex[j].method.section)
                // console.log(ex[j].method.args.length)
                // console.log(ex[j].method.args[0].toJSON().id)
                // console.log(ex[j].method.args[3]?.toHex())
                if (ex[j].isSigned&&ex[j].method.method=="call"&&ex[j].method.section=="contracts"&&ex[j].method.args.length==4&&ex[j].method.args[0].toJSON().id=="1wLVQRTu6cfioW86PBVDG8nk9cvvmX3vaCJoji91UT4Desu"&&ex[j].method.args[3].toHex().substr(0,10)=="0x2393fe3a"){
                    console.log("is dbfactory")
                }
            }
        }
        // else{
        //     console.log("getblock is Empty")
        // }
    }
  }
  
  main().catch((error) => {
    console.error(error);
    process.exit(-1);
  });