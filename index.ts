import { InitConfig } from "@credo-ts/core";
import { Agent } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { JWK } from "jose";
import { createDIDPrivateKey, createDIDPublicJWK } from "./dids/create";
import { resolveDID, getAllDIDsinWallet } from "./dids/resolve";

const privKey: JWK = {
    "crv": "Ed25519",
    "d": "hLraQTB2lPhdbSzT8Am3L2Q24UtHkZzEuolUoE92yoU",
    "x": "EvlIMqVP4gltfy3bxwK-3UUFzlL-NTfDBf5nvhDKcwQ",
    "kty": "OKP"
};

const pubKey: JWK = {
    "crv": "Ed25519",
    "x": "EvlIMqVP4gltfy3bxwK-3UUFzlL-NTfDBf5nvhDKcwQ",
    "kty": "OKP",
    "kid": "0DaI_ptRiWdPmEmhTD2c_DhkM8bngE9DMKONm62lSJ0"
};

const setupAgent = async () => {
	// Credo Initialization configuration
	// setup store and wallet
	const config: InitConfig = {
		label: 'docs-agent-nodejs',
		walletConfig: {
			id: 'wallet-id-2',
			key: 'testkey0000000000000000000000000',
			storage: {
				type: 'sqlite',
				// config: {
				// 	inMemory: true,
				// }
			},
		},
	}
	
	// create agent - here Aries Askar
	const agent = new Agent({
		config,
		dependencies: agentDependencies,
		modules: {
			// Register the Askar module on the agent
			askar: new AskarModule({
				ariesAskar,
			}),
		},
	});

	// operations in the credo wallet can only be performed once the agent is initialized
	await agent.initialize();

	return agent;
}
const main = async () => {

	const agent = await setupAgent();

	const did1 = await createDIDPublicJWK(agent, pubKey);
	console.log("DID1 ::: ",  did1.didState.did)
	// this method creates a key in the wallet and then generates the DID
	// this will throw error if we run the function again with the same private key
	// recommend to change the private key or else comment this code.
	const did2 = await createDIDPrivateKey(agent, "96213c3d7fc8d4d6754c7a0fd969598l");
	console.log("DID2 ::: ",  did2.didState.did);

	const didDoc = await resolveDID(agent, did1.didState.did!);

	const allDIDs = await getAllDIDsinWallet(agent, "key");

	await agent.wallet.close();
	await agent.shutdown();
} 

main();