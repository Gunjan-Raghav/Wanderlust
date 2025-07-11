const mongoose=require("mongoose");
const Listing= require("../models/listing.js");
const initData =require("./data.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"684d7e1964addb9830f02a42",
    }));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
  };
  initDB();
// const initDB=async ()=>{
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");



// };
// initDB();