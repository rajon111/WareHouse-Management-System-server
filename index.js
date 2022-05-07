const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

//MIDDLEWARE
app.use(cors())
app.use(express.json())

//user-sportsWarehouse
//pass - sbCZMRt7jFMCeuD6

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zehhr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// const collection = client.db("sportsWareHouse").collection("products");
async function run(){
  try{

  }
  finally{

  }

}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(port, () => {
    console.log('Example is listening at ',port)
})