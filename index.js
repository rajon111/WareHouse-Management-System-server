const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

//MIDDLEWARE
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zehhr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const productCollection = client.db("sportsWareHouse").collection("products");
    const itemtCollection = client.db("sportsWareHouse").collection("myitem");

    //GET- all product
    app.get('/inventory', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    //GET- product by id
    app.get('/inventory/:id',async(req, res) =>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const product = await productCollection.findOne(query)
      res.send(product)
    })

    //PUT-update
    app.put('/inventory/:id', async(req,res)=>{
      const id= req.params.id
      const updateQuantity = req.body
      const filter = {_id:ObjectId(id)}
      const options = {upsert:true}
      const updateDoc = {
        $set:{
          quantity:updateQuantity.manage
        } 
      }
      const result = await productCollection.updateOne(filter,updateDoc,options)
      res.send(result)

    })

    //DELETE
    app.delete('/delete/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await productCollection.deleteOne(query)
      res.send(result)
    })

    
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