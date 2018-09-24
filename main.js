const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
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
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {

                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        
        return balance;
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
signalCoin.createTransaction(new Transaction('address1', "address2", 100));
signalCoin.createTransaction(new Transaction('address2', "address1", 50))

console.log('\n Starting the miner...');
signalCoin.minePendingTransactions('someones-address');

console.log('\n Balance of someone is', signalCoin.getBalanceOfAddress('someones-address'));

console.log('\n Starting the miner...');
signalCoin.minePendingTransactions('someones-address');

console.log('\n Balance of someone is', signalCoin.getBalanceOfAddress('someones-address'));



// console.log('Mining block 1....');

// signalCoin.addBlock(new Block(1, "12/09/2018", { amount: 4 }))
// console.log('Mining block 2....');

// signalCoin.addBlock(new Block(2, "12/09/2018", { amount: 10 }))


// use below log to look at the blocks
// console.log(JSON.stringify(signalCoin, null, 4))

// // // logging the chain without a tamper attempt, should return true, the chain is valid
// console.log('Is the blockchain valid?', signalCoin.isChainvalid())

// // // attempting to tamper the chain by saying the transaction was 9001 instaed of 4
// signalCoin.chain[1].data = { amount: 9001 }

// // // below log should return that the blockchain is false (invalid) due to the tampering above
// console.log('Is the blockchain valid?', signalCoin.isChainvalid())