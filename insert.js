const mongoose=require("mongoose");
var MongoClient=require("mongodb").MongoClient;
const { response } = require('express');
var url="mongodb+srv://ziad:ZAheg1234@cluster0.odloe.mongodb.net/project?retryWrites=true&w=majority";
mongoose.Promise=global.Promise;
mongoose.connect(url,function(err,db){
  if(err) throw err;
});
var schema2= new mongoose.Schema({username:String,list:Array})
var Cart=mongoose.model("cart",schema2);
var nameSchema=new mongoose.Schema({username:String,password:String});
var User=mongoose.model("users",nameSchema);
var schema3=new mongoose.Schema({type:String,name:String,img:String});
var Item=mongoose.model("items",schema3);
var quer1=User.deleteMany();
quer1.exec(function(err,res){

})
var quer2=Cart.deleteMany();
quer2.exec(function(err,res){
  
})
