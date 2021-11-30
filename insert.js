const mongoose=require("mongoose");
var MongoClient=require("mongodb").MongoClient;
const { response } = require('express');
var url="mongodb+srv://ziad:ZAheg1234@cluster0.odloe.mongodb.net/project?retryWrites=true&w=majority";
mongoose.Promise=global.Promise;
mongoose.connect(url,function(err,db){
  if(err) throw err;
});
var nameSchema=new mongoose.Schema({username:String,password:String});
var User=mongoose.model("users",nameSchema);
var object= new User();
object.username="ziad";
object.password="ZAheg1234";
object.save(function(err,res){
  if(err) throw err;
})

