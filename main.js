var express = require("express");
//const async = require("hbs/lib/async");
const { ObjectId } = require("mongodb");
var app = express();

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));



//duong dan den database
// var url = 'mongodb://127.0.0.1:27017';
var url ="mongodb+srv://tueconchuonchuon:3112002@demoup.z6bhx3y.mongodb.net/test";
//import thu vien MongoDB
var MongoClient = require("mongodb").MongoClient;

app.get("/", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  let products = await dbo.collection("product").find().toArray();
  res.render("home", {products});
  
});


app.post('/search', async (req, res) => {
  let nameSearch = req.body.txtName
  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  let products = await dbo.collection("product").find({ 'name': new RegExp(nameSearch)}).toArray()
  res.render('allProduct', { 'products': products })
})

app.get("/viewAll", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  let products = await dbo.collection("product").find().toArray();
  res.render("allProduct", { products: products });
});

app.get("/delete",async (req, res)=> {
  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  let products = await dbo.collection("product").deleteOne({_id: new ObjectId(req.query.id)});
  res.redirect("/viewAll");
}
)

app.post("/createProduct", async (req, res) => {
  let name = req.body.txtName;
  let price = req.body.txtPrice;
  let category = req.body.txtCategory;
  let picURL = req.body.txtPicture;
  let product = {
    name: name,
    price: price,
    category: category,
    picURL: picURL,
  };

  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  await dbo.collection("product").insertOne(product);
  res.redirect("/");
});

app.get("/create", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("TGX");
  let category = await dbo.collection("category").find().toArray();

  res.render("createProduct",{category});
});



const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running!");
