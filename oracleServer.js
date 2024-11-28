MongoDB와 Oracle 서버 설정

const { ethers } = require("ethers");
const MongoClient = require("mongodb").MongoClient;
const fetch = require("node-fetch");

// MongoDB 연결 URL
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB에서 어음 데이터 가져오기
async function getNoteDataFromMongo(noteId) {
    await client.connect();
    const database = client.db("digitalNotes");
    const collection = database.collection("notes");
    
    const note = await collection.findOne({ noteId: noteId });
    client.close();
    return note;
}

// 스마트 계약 업데이트 함수
async function updateNoteInBlockchain(noteId, noteData) {
    const provider = new ethers.JsonRpcProvider("YOUR_ETH_NODE_URL");
    const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
    const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS";
    const abi = [
        "function updateNoteData(uint256 noteId, string memory issuerInfo, string memory receiverInfo) public"
    ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    const tx = await contract.updateNoteData(
        noteId,
        noteData.issuerInfo,
        noteData.receiverInfo
    );
    await tx.wait();
    console.log(`Note ${noteId} updated on blockchain.`);
}

// MongoDB와 블록체인 데이터 동기화 함수
async function syncData() {
    const noteId = 1; // 예시로 noteId가 1인 어음을 가져옵니다.
    const noteData = await getNoteDataFromMongo(noteId);
    
    if (noteData) {
        await updateNoteInBlockchain(noteId, noteData);
    } else {
        console.log(`Note with ID ${noteId} not found in MongoDB.`);
    }
}

syncData();
