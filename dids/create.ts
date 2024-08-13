import { InitConfig, Key, KeyDidCreateOptions, KeyType, TypedArrayEncoder, WalletCreateKeyOptions, Ed25519Jwk } from "@credo-ts/core";
import { Agent } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { JWK } from "jose";

// create a did using public key JWK
export const createDIDPublicJWK = async (agent: Agent<{askar: AskarModule;}>, publicKey: JWK) => {

    // create ed25519 jwk object using Credo's utility
	const jwkPubKey = new Ed25519Jwk({x: publicKey.x!});
	console.log(jwkPubKey.publicKey);

    // create Key object using the public key buffer
	const inputPublicKey: Key = new Key(jwkPubKey.publicKey, KeyType.Ed25519);
	console.log(inputPublicKey);

    // create the did object
	const  didcreate: KeyDidCreateOptions = {
		method: 'key',
		options: {
			key: inputPublicKey,
		},
		
	};
    const did = await agent.dids.create(didcreate);
	console.log("DID CREATED ::: ", did);

    return did;
}


// create a did using public key JWK
export const createDIDPrivateKey = async (agent: Agent<{askar: AskarModule;}>, privateKey: string) => {

    // create key object using private key  
	const walletKeyCreate: WalletCreateKeyOptions = {
		keyType: KeyType.Ed25519,
		privateKey: TypedArrayEncoder.fromString(privateKey),
	};

    // create key in the Askar Wallet
	const myKey = await agent.wallet.createKey(walletKeyCreate);

	const  didcreate: KeyDidCreateOptions = {
		method: 'key',
		options: {
			key: myKey,
		},
		
	};
	const did = await agent.dids.create(didcreate);

	console.log("DID CREATED ::: ", did);

    return did;

}