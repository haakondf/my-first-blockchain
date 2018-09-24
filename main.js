const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}



class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainvalid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // checking (recalculating) the hash to test if it is in fact the correct block

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // checking if the current block is pointing to the previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let signalCoin = new Blockchain();
console.log('Mining block 1....');

signalCoin.addBlock(new Block(1, "12/09/2018", { amount: 4 }))
console.log('Mining block 2....');

signalCoin.addBlock(new Block(2, "12/09/2018", { amount: 10 }))


// use below log to look at the blocks
// console.log(JSON.stringify(signalCoin, null, 4))

// // // logging the chain without a tamper attempt, should return true, the chain is valid
// console.log('Is the blockchain valid?', signalCoin.isChainvalid())

// // // attempting to tamper the chain by saying the transaction was 9001 instaed of 4
// signalCoin.chain[1].data = { amount: 9001 }

// // // below log should return that the blockchain is false (invalid) due to the tampering above
// console.log('Is the blockchain valid?', signalCoin.isChainvalid())