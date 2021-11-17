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
  res.render("index",{wrong:""});
});
app.get("/log",function(req,res){
  res.render("index",{wrong:""});
})
app.post("/log",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;
  var query=User.find({"username":user,"password":pass});
  query.exec(function(err,result){
    if(err) throw err;
    if(result.length==0){
      res.render("index",{wrong:"a"});
    }else{
      console.log(false);
      res.render("index3",{Welocme:"You Logged in"});
    }
  })
});
app.post("/sign",function(req,res){
  res.render("index2",{repeat:""});
});
app.get("/submit",function(req,res){
  res.render("index2",{repeat:"a"});
})
app.post("/submit",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;
  var flag=false;
  var array=User.find({"username":user});
  var arr2=[];
  array.exec(function(err,arr){
    if(err) throw err;
    if(arr.length>0){
      res.render("index2",{repeat:"a"});
    }else{
      var mydata=new User({username:user,password:pass});
      mydata.save(function(err,res1){
      if(err) throw err;
      })
      res.render("index3");
    }
  });
});
if(process.env.PORT){
  app.listen(process.env.PORT,function(){
    console.log("ok");
  });
}
else{
  app.listen(4000);
}
