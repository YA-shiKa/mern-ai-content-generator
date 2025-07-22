const mongoose=require('mongoose');
// PASSWORD : MKQgKn8B1UWxhd5A
// myashika2005
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect('mongodb+srv://myashika2005:MKQgKn8B1UWxhd5A@mern-ai.jbtiirf.mongodb.net/mern-ai?retryWrites=true&w=majority&appName=MERN-AI')
        console.log(`Mongodb connected ${conn.connection.host}`);
    }catch(error){
        console.error(`Error connecting to MongoDB ${error.message}`);
        process.exit(1);
    }
}
module.exports=connectDB;