import { DidCreateOptions, InitConfig, Key, KeyDidCreateOptions, KeyType, TypedArrayEncoder, WalletApi, WalletConfig, WalletCreateKeyOptions, Ed25519Jwk } from "@credo-ts/core";
import { Agent, Wallet } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule, AskarWallet } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import jose, { importJWK, exportJWK, JWK, generateKeyPair } from "jose";

const privKey: JWK = {
	"crv": "Ed25519",
	"d": "WMyT0IX3Zoh8L_fNjh5RznAreHUZfE3cLBRTUYc9jIk",
	"x": "76mKj3Ajcb0FAR2X5vJ-Uwj1J1mmD4N0xe5ErV2HCY8",
	"kty": "OKP"
};


const importkeys = async (priv: JWK) => {
	const privKeyUint = await importJWK(priv, 'EdDSA');
	console.log(TypedArrayEncoder.fromString(JSON.stringify(priv)));

}
const createWalletFromPrivKey = async (priv: JWK) => {
	// const privKeyUint = await importJWK(priv, 'EdDSA');

	const config: InitConfig = {
		label: 'docs-agent-nodejs',
		walletConfig: {
			id: 'wallet-id',
			key: 'testkey0000000000000000000000000',
			storage: {
				type: 'sqlite',
				config: {
					inMemory: true,
				}
			},
		},
	}
	
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
	await agent.initialize();
	const walletConfig: WalletCreateKeyOptions = {
		keyType: KeyType.Ed25519,
		privateKey: TypedArrayEncoder.fromString('96213c3d7fc8d4d6754c7a0fd969598m'),
	};

	const myKey = await agent.wallet.createKey(walletConfig);
	const  didcreate: KeyDidCreateOptions = {
		method: 'key',
		options: {
			key: myKey,
		},
	};
	const did = await agent.dids.create(didcreate);
	console.log(did);
	console.log('vfm:', JSON.stringify(did.didState.didDocument?.verificationMethod));

	await agent.wallet.close();
	await agent.shutdown();
} 

// createWalletFromPrivKey(privKey);
importkeys(privKey);