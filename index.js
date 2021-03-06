const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
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

    function verifyJWT(req,res,next){
      const authHeader = req.headers.authorization
      if(!authHeader){
        return res.status(401).send({message:'unauthorized access'})
      }
      const token=authHeader.split(' ')[1]
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
          return res.status(403).send({message:'Forbidden access'})
        }
        req.decoded=decoded
        next()
      })
    }

    //Auth
    app.post('/login', async(req,res)=>{
      const user = req.body
      const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'1d'
      })
      res.send({accessToken})
    })

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

    //POST
    app.post('/add', async(req,res) =>{
      const newProduct = req.body
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    //GET-my items
    app.get('/myitems',verifyJWT ,async(req,res)=>{
      const decodedEmail = req.decoded.email
      const email = req.query.email

      if(email===decodedEmail){
        const query= {email}
        const cursor = productCollection.find(query)
        const myitems = await cursor.toArray()
        res.send(myitems)
      }
      else{
        res.status(403).send({message:'Forbidden access'})
      }
      
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