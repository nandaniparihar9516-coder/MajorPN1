const mongoose = require("mongoose");
const data = require ("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const initData =require("./data.js");
main()
.then(()=>{
    console.log("connection to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB =async ()=>{
   await  Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>
    ({...obj,
     owner:"6ab6a5f2caca4a17022378dc",
      geometry: { type: "Point", coordinates: [77.2090, 28.6139]}}));
   await Listing.insertMany(data.data);
   console.log("data was initialized");
};
initDB();clearImmediate