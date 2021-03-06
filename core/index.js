const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Network() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100, '0', '0');
}

Network.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index:this.chain.length+1,
        timestamp:Date.now(),
        transactions:this.pendingTransactions,
        nonce:nonce,
        hash:hash,
        previousBlockHash:previousBlockHash
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
}

Network.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Network.prototype.createNewTransaction = function(amount, sender, recipent) {
    const newTransaction = {
        importance:amount,
        sender:sender,
        recipent:recipent,
        messageId: uuid().split('-').join('')
    };
    return newTransaction;
}

Network.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index']+1;
}


Network.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Network.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
    while(hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
    }
    return nonce;
}

module.exports = Network;
