const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const app = express();
const port = process.env.port || 3000;
app.use(cors());
app.use(express.json());
let db;
(async()=>{
  db=await open({
    filename:'./databaseFolder/database.sqlite',
    driver:sqlite3.Database
  });
})();
//Get All Restaurants
async function fetchAllRestaurants(){
  let query='SELECT * FROM restaurants';
  let response=await db.all(query,[]);
  return {restaurants:response};
}
app.get('/restaurants',async(req,res)=>{
  try{
    let result=await fetchAllRestaurants();
    if(result.restaurants.length===0){
      res.status(404).json({message:'No restaurants found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get restaurant by id
async function getRestaurantsByID(id){
  let query='SELECT * FROM restaurants WHERE id= ?';
  let response=await db.all(query,[id]);
  return {restaurants:response};
}
app.get('/restaurants/details/:id',async(req,res)=>{
  let id=req.params.id;
  try{
    let result=await getRestaurantsByID(id);
    if(result.restaurants.length===0){
      res.status(404).json({message:'No restaurants found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get Restaurants by Cuisine
async function getRestaurantsByCuisine(cuisine){
  let query='SELECT * FROM restaurants WHERE cuisine= ?';
  let response=await db.all(query,[cuisine]);
  return {restaurants:response};
}
app.get('/restaurants/cuisine/:cuisine',async(req,res)=>{
  let cuisine=req.params.cuisine;
  try{
    let result=await getRestaurantsByCuisine(cuisine);
    if(result.restaurants.length===0){
      res.status(404).json({message:'No restaurants found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get Restaurants by Filter
async function getRestaurantsByFilter(isVeg,hasOutdoorSeating,isLuxury){
  let query='SELECT * FROM restaurants WHERE isVeg= ? AND hasOutdoorSeating= ? AND isLuxury= ?';
  let response=await db.all(query,[isVeg,hasOutdoorSeating,isLuxury]);
  return {restaurants:response};
}
app.get('/restaurants/filter',async(req,res)=>{
  let isVeg=req.query.isVeg;
  let hasOutdoorSeating=req.query.hasOutdoorSeating;
  let isLuxury=req.query.isLuxury;
  try{
    let result=await getRestaurantsByFilter(isVeg,hasOutdoorSeating,isLuxury);
    if(result.restaurants.length===0){
      res.status(404).json({message:'No restaurants found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
// Get Restaurants Sorted by Rating high to low
async function getRestaurantSortByRating(){
  let query='SELECT * FROM restaurants ORDER BY rating DESC';
  let response=await db.all(query,[]);
  return {restaurants:response};
}
app.get('/restaurants/sort-by-rating',async(req,res)=>{
  try{
    let result=await getRestaurantSortByRating();
    if(result.restaurants.length===0){
      res.status(404).json({message:'No restaurants found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});

//Get all dishes
async function getAllDishes(){
  let query='SELECT * FROM dishes';
  let response=await db.all(query,[]);
  return {dishes:response};
}
app.get('/dishes',async(req,res)=>{
  try{
    let result=await getAllDishes();
    if(result.dishes.length===0){
      res.status(404).json({message:'No such dishes found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get Dish by ID
async function getDishByID(id){
  let query='SELECT * FROM dishes WHERE id= ?';
  let response=await db.all(query,[id]);
  return ({dishes:response});
}
app.get('/dishes/details/:id',async(req,res)=>{
  let id=req.params.id;
  try{
    let result=await getDishByID(id);
    if(result.dishes.length===0){
      res.status(404).json({message:'No such dishes found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get Dishes by Filter
async function getDishByFilter(isVeg){
  let query='SELECT * FROM dishes WHERE isVeg= ?';
  let response=await db.all(query,[isVeg]);
  return ({dishes:response});
}
app.get('/dishes/filter',async(req,res)=>{
  let isVeg=req.query.isVeg;
  try{
    let result=await getDishByFilter(isVeg);
    if(result.dishes.length===0){
      res.status(404).json({message:'No such dishes found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
//Get Dishes Sorted by Price low to high
async function getDishesSortByPrice(){
  let query='SELECT * FROM dishes ORDER BY price';
  let response=await db.all(query,[]);
  return ({dishes:response});
}
app.get('/dishes/sort-by-price',async(req,res)=>{
  try{
    let result=await getDishesSortByPrice();
    if(result.dishes.length===0){
      res.status(404).json({message:'No such dishes found.'});
    }
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
