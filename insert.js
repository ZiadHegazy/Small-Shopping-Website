const mongoose=require("mongoose");
var url="mongodb://localhost:27017/database";
mongoose.Promise=global.Promise;
mongoose.connect(url,function(err,db){
  if(err) throw err;
});
var nameSchema=new mongoose.Schema({username:String,password:String});
var User=mongoose.model("user",nameSchema);
var mydata=new User({username:"ziad",password:"ZAheg1234"});
mydata.save(function(err,res1){
  if(err) throw err;
})