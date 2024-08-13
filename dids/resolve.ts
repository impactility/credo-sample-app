import { InitConfig, Key, KeyDidCreateOptions, KeyType, TypedArrayEncoder, WalletCreateKeyOptions, Ed25519Jwk } from "@credo-ts/core";
import { Agent } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { JWK } from "jose";

// create a did using public key JWK
export const resolveDID = async (agent: Agent<{askar: AskarModule;}>, did: string) => {

    const didDoc = await agent.dids.resolveDidDocument(did);
	console.log("DID DOCUMENT ::: ", didDoc);
    return didDoc;
}

export const getAllDIDsinWallet = async (agent: Agent<{askar: AskarModule;}>, method: string) => {

    // get all DID records from the Askar wallet
    const dids = await agent.dids.getCreatedDids({ method: method });
    console.log("DIDs ::: ", dids);
    return dids;
}