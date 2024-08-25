import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import base58 from "bs58";

async function drainWallet(connection, fromKeypair, toPublicKey) {
    try {
        // Get SOL balance
        const balance = await connection.getBalance(fromKeypair.publicKey);
        
        if (balance > 0) {
            // Create transaction to transfer SOL
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: toPublicKey,
                    lamports: balance - 5000 // Leave a small amount for transaction fee
                })
            );

            // Sign and send transaction
            const signature = await connection.sendTransaction(transaction, [fromKeypair]);
            console.log("Transaction signature", signature);
        } else {
            console.log("No SOL to transfer");
        }

        // Add logic to transfer SPL tokens and NFTs here

    } catch (error) {
        console.error("Error draining wallet:", error);
    }
}

async function main() {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const fromKeypair = Keypair.fromSecretKey(base58.decode("PRIVATE_KEY"));
    const toPublicKey = new PublicKey("ADDRESS_DESTINATION");

    while (true) {
        await drainWallet(connection, fromKeypair, toPublicKey);
        await new Promise(r => setTimeout(r, 1000)); // Pause for 1 seconds
    }
}

main();
