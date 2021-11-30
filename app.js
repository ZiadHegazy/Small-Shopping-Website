var express = require('express');
var path = require('path');
var app = express();
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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/" ,function(req,res){
  res.render("login",{wrong:""});
});
app.post("/",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;
  console.log(user+" "+pass);
  var query=User.find({"username":user,"password":pass});
  query.exec(function(err,result){
    if (err) throw err;
    console.log(result);
    if(result.length==0){
      res.render("login",{wrong:"Wrong user name or passowrd"});
    }else{
      res.render("home");
    }
  })
})
if(process.env.PORT){
  app.listen(process.env.PORT,function(){
    console.log("ok");
  });
}
else{
  app.listen(4000);
}