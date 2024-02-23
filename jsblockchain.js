const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress =fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }
}

class Block{
    constructor(index, timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //we will be using SHA 256 cryptographic Fn 
        //to generate the hash of this block
        return SHA256(+this.timestamp+this.previousHash+JSON.stringify(this.transactions)+this.nonce).toString();
    }

    mineNewBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new Block was mined with hash: " + this.hash);

    }
}

class Blockchain{
    constructor(){
        //the blocks of blockchain will be represented by an array
        //the first element of the array will be the genesis block, created manually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //nonce difficulty for the hash value
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock(){
        return new Block("01/01/2024", "This is the genesis block", "0");
    }
    //next steps to be implemented:
    //new block object
    //the hash of the previous block
    //calculate the hash of current block

    getLatestBlock(){//returns the index of the chain
        return this.chain[this.chain.length-1]
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineNewBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block has been mined successfully");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getbalanceOfAddress(address) {
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
    
    //adding security functionalities
    checkvalidBlockChain(){
        for (let i=1; i<this.chain.length; i++ ){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

//creating two new blocks
// let block1 = new Block(1, "02,01,2024", {mybalance: 100});
// let block2 = new Block(2, "03,01,2024", {mybalance: 50});

//create a new blockchain
// let myBlockChain = new Blockchain();

// //adding the new blocks to the blockchain
// console.log("The first block is created");
// myBlockChain.addBlock(block1);
// console.log("The second block is created");
// myBlockChain.addBlock(block2);

//console.log(JSON.stringify(myBlockChain,null,4)); //getting the whole Blockchain
//Validation of the generated Blockchain
// console.log("Validation checking for the Block before hacking : " + myBlockChain.checkvalidBlockChain());

//emulating  a change in one of the blocks
// myBlockChain.chain[1].data = {mybalance: 3490};
// console.log(JSON.stringify(myBlockChain,null,4));
// console.log("Validation checking for the Block after hacking : " + myBlockChain.checkvalidBlockChain());

let gyroCoin = new Blockchain();

transaction1 = new Transaction("tom", "jerry", 100);
gyroCoin.createTransaction(transaction1);

transaction2 = new Transaction("jerry", "tom", 50);
gyroCoin.createTransaction(transaction2);

console.log("Started Mining by the miner...");
gyroCoin.minePendingTransactions("donald");

//checking balance
console.log("Balance for tom is: " +gyroCoin.getbalanceOfAddress("tom"));
console.log("Balance for jerry is: " +gyroCoin.getbalanceOfAddress("jerry"));
console.log("Balance for donald is: " +gyroCoin.getbalanceOfAddress("donald"));

console.log("Started Mining again by the miner...");
gyroCoin.minePendingTransactions("donald");
console.log("Balance for donald is: " +gyroCoin.getbalanceOfAddress("donald"))




