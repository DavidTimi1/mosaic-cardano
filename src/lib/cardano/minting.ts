import { Transaction, AppWallet, IInitiator } from '@meshsdk/core';
import { uploadJSONToIPFS } from '../ipfs';

export interface ContributionManifest {
  title: string;
  contentHash: string; // IPFS URI of the raw document
  communityId: string;
  contributors: {
    userId: string;
    name: string;
    role: string;
    weight: number;
    signature: string;
  }[];
  timestamp: number;
}

/**
 * Anchors the contribution manifest to the Cardano blockchain via a metadata transaction.
 * Returns the transaction hash.
 */
export async function anchorContributionManifest(
  manifest: ContributionManifest
): Promise<string> {
  // 1. Upload the manifest JSON to IPFS first to get a permanent CID for the metadata
  const manifestIpfsUri = await uploadJSONToIPFS(manifest as unknown as Record<string, unknown>, `${manifest.title} - Manifest`);
  
  // 2. We use AppWallet since this is a backend-driven minting process (or we could use BrowserWallet on frontend)
  // For this architecture, since we don't have the user's keys on the backend, 
  // normally the user's browser wallet would sign the tx.
  // But for the "Village Treasury" or "App Wallet" anchoring:
  const mnemonic = process.env.APP_WALLET_MNEMONIC;
  if (!mnemonic) {
    console.warn('APP_WALLET_MNEMONIC is not set.');
    throw new Error("APP_WALLET_MNEMONIC env variable not set!")
  }

  try {
    const wallet = new AppWallet({
      networkId: 0, // 0 for Testnet, 1 for Mainnet
      fetcher: undefined, // Requires a provider like Blockfrost in production
      submitter: undefined,
      key: {
        type: 'mnemonic',
        words: mnemonic.split(' '),
      },
    });

    const tx = new Transaction({ initiator: wallet as unknown as IInitiator });
    
    // We attach the manifest CID as transaction metadata (label 721 or custom)
    // Using a custom label 2026 for Mosaic Contributions
    tx.setMetadata(2026, {
      type: 'MosaicContribution',
      manifestUri: manifestIpfsUri,
      title: manifest.title,
      communityId: manifest.communityId
    });

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    
    return txHash;
  } catch (error) {
    console.error('Failed to anchor to Cardano:', error);
    throw new Error("Failed to anchor contribution to Cardano!")
  }
}
