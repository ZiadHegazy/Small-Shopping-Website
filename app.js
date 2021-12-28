
var express = require('express');
var path = require('path');
var app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const mongoose=require("mongoose");
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
let name;
var url="mongodb+srv://ziad:ZAheg1234@cluster0.odloe.mongodb.net/project?retryWrites=true&w=majority";
mongoose.Promise=global.Promise;
mongoose.connect(url,function(err,db){
  if(err) throw err;
});
var schema3=new mongoose.Schema({type:String,name:String,img:String});
var Item=mongoose.model("items",schema3);
var nameSchema=new mongoose.Schema({username:String,password:String});
var User=mongoose.model("users",nameSchema);
var schema2= new mongoose.Schema({username:String,list:Array})
var Cart=mongoose.model("cart",schema2);
app.set('views', path.join(__dirname, 'views'));
// store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}
app.set('view engine', 'ejs');
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.get("/" ,function(req,res){
  
  res.render("login",{wrong:""});
});
app.get("/home",function(req,res){
  if(req.session.name){
    res.render("home");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
})
app.get("/temp",function(req,res){
  if(req.session.name){
    res.render("home");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
})
app.get("/cart1",function(req,res){
  if(req.session.name){
    res.render("cart1");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
})
app.get("/login",function(req,res){
  res.render("login",{wrong:""});
})
app.get("/searchresults",function(req,res){
  if(req.session.name){
    res.render("searchresults",{list:[]});
  }else{
    res.render("login",{wrong:"You must login first"});
  }
})
app.get("/registration",function(req,res){
  res.render("registration",{wrong:""});
});
app.post("/search",function(req,res){
  var s=req.body.Search;
  var query=Item.find();
  query.exec(function(err,result){
    if (err) throw err;
    var arr=[];
    var i=0;
    for(i=0;i<result.length;i++){
      if((result[i].name.toLower()).includes(s.toLower())){
        arr=arr.concat([result[i].name]);
      }
    }

    res.render("searchresults",{list:arr});

  });

});
app.get("/add-tennis",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name
  });
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="tennis racket"){
        arr[i]=["sports","tennis racket",arr[i][2]+1];
      }
    }
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  });}else{
    res.render("login",{wrong:"You must login first"});
  } 
});
app.get("/min-tennis",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="tennis racket"){
        arr[i]=["sports","tennis racket",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); }else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.get("/del-tennis",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="tennis racket"){
        arr=arr.concat([list[i]]);
      }
      
    }
   
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/del-boxing",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="boxing bag"){
        arr=arr.concat([list[i]]);
      }
      
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/del-sun",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="the sun and her flowers"){
        arr=arr.concat([list[i]]);
      }
      
    }
   
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/del-leaves",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="leaves of grass"){
        arr=arr.concat([list[i]]);
      }
      
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/del-galaxy",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="galaxy s21"){
        arr=arr.concat([list[i]]);
      }
      
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/del-iphone",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      if(list[i][1]!="iphone 13 pro"){
        arr=arr.concat([list[i]]);
      }
      
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 

}else{
  res.render("login",{wrong:"You must login first"});
}
})
app.get("/min-boxing",function(req,res){
 if(req.session.name){ var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="boxing bag"){
        arr[i]=["sports","boxing bag",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  })  
}else{
  res.render("login",{wrong:"You must login first"});
}
}) 
app.get("/min-sun",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="the sun and her flowers"){
        arr[i]=["books","the sun and her flowers",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/min-leaves",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="leaves of grass"){
        arr[i]=["books","leaves of grass",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/min-iphone",function(req,res){
 if(req.session.name) {var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="iphone 13 pro"){
        arr[i]=["phones","iphone 13 pro",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/min-galaxy",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="galaxy s21"){
        arr[i]=["phones","galaxy s21",arr[i][2]-1];
      }
    }
    i=0;
    var arr3=[];
    for(i=0;i<arr.length;i++){
      if(arr[i][2] != 0){
        arr3=arr3.concat([arr[i]]);
      }
    }
    
    i=0;
    for(i=0;i<arr3.length;i++){
      if(i!=arr3.length-1){
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr3[i].length;j++){
          list2=list2.concat([arr3[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr3},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/add-boxing",function(req,res){
 if(req.session.name) {var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="boxing bag"){
        arr[i]=["sports","boxing bag",arr[i][2]+1];
      }
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/add-galaxy",function(req,res){
 if(req.session.name){ var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="galaxy s21"){
        arr[i]=["phones","galaxy s21",arr[i][2]+1];
      }
    }
   
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/add-iphone",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="iphone 13 pro"){
        arr[i]=["phones","iphone 13 pro",arr[i][2]+1];
      }
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/add-sun",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="the sun and her flowers"){
        arr[i]=["books","the sun and her flowers",arr[i][2]+1];
      }
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/add-leaves",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    var list=result[0].list;
    var i=0;
    var arr=[];
    var list2=[];
    for(i=0;i<list.length;i++){
      arr=arr.concat([list[i]]);
    }
    for(i=0;i<arr.length;i++){
      if(arr[i][1]=="leaves of grass"){
        arr[i]=["books","leaves of grass",arr[i][2]+1];
      }
    }
    
    i=0;
    for(i=0;i<arr.length;i++){
      if(i!=arr.length-1){
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<arr[i].length;j++){
          list2=list2.concat([arr[i][j]]);
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:list},{username:req.session.name,list:arr},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("cart1");
  }); 
}else{
  res.render("login",{wrong:"You must login first"});
}
});
app.get("/phones",function(req,res){
  if (req.session.name){
    res.render("phones");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.get("/books",function(req,res){
  if (req.session.name){
    res.render("books");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.get("/sports",function(req,res){
  if (req.session.name){
    res.render("sports");
  }else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.get("/boxing",function(req,res){
  if (req.session.name){
    res.render("boxing",{done:""});

  }else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.get("/tennis",function(req,res){
  if (req.session.name){
    res.render("tennis",{done:""});

  }else{
    res.render("login",{wrong:"You must login first"});
  }
  
});
app.get("/iphone",function(req,res){
  if (req.session.name){
    res.render("iphone",{done:""});

  }else{
    res.render("login",{wrong:"You must login first"});
  }

  
});
app.get("/galaxy",function(req,res){
  if (req.session.name){
    res.render("galaxy",{done:""});

  }else{
    res.render("login",{wrong:"You Must Login in first"});
  }

  
});
app.get("/leaves",function(req,res){
  if (req.session.name){
    res.render("leaves",{done:""});

  }else{
    res.render("login",{wrong:"You Must Login in first"});
  }

});
app.get("/sun",function(req,res){
  if (req.session.name){
    res.render("sun",{done:""});

  }else{
    res.render("login",{wrong:"You Must Login in first"});
  }

  
});
app.post("/signup",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;
  if(user=="" || pass=="" ){
    res.render("registration",{wrong:"must enter a username and password"});
  }else{
  var query=User.find({username:user});
  query.exec(function(err,result){
    if(err) throw err;
    if(result.length==0){
      var object=new User({username:user,password:pass});
      object.save();
      var c=new Cart({username:user,list:[]});
      c.save();
      name=user;
      req.session.name=user;
      res.render("home");
    }else{
      res.render("registration",{wrong:"user name is already taken"});
    }
 })
}
});



app.get("/cart",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var list=result[0].list;
    var list2=[];
    var i=0;
    for(i=0;i<list.length;i++){
      if(i!=list.length-1){
        var j=0 
        for(j=0;j<list[i].length;j++){
          list2=list2.concat([list[i][j]]);
        }
        list2=list2.concat(["-"]);
      }else{
        var j=0 
        for(j=0;j<list[i].length;j++){
          list2=list2.concat([list[i][j]]);
        }
      }
    }
    var a=require("./try");
    res.render("cart",{list:list2});
  })}else{
    res.render("login",{wrong:"You must login first"});
  }

  
});
app.get("/phone-galaxy",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="phones" && arr[i][1]=="galaxy s21"){
        flag=true;
      }
    }
    var object=["phones","galaxy s21",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="phones" && arr2[i][1]=="galaxy s21"){
          arr2[i]=["phones","galaxy s21",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"galaxy"});
  });}else{
    res.render("login",{wrong:"You Must login in first"});
  }
});
app.get("/phone-iphone",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="phones" && arr[i][1]=="iphone 13 pro"){
        flag=true;
      }
    }
    var object=["phones","iphone 13 pro",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="phones" && arr2[i][1]=="iphone 13 pro"){
          arr2[i]=["phones","iphone 13 pro",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"iphone"});
  });}else{
    res.render("login",{wrong:"You Must login in first"});
  }
});
app.get("/book-leaves",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="books" && arr[i][1]=="leaves of grass"){
        flag=true;
      }
    }
    var object=["books","leaves of grass",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="books" && arr2[i][1]=="leaves of grass"){
          arr2[i]=["books","leaves of grass",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"leaves"});

  });}else{
    res.render("login",{wrong:"You Must login in first"});
  }
});
app.get("/book-sun",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="books" && arr[i][1]=="the sun and her flowers"){
        flag=true;
      }
    }
    var object=["books","the sun and her flowers",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="books" && arr2[i][1]=="the sun and her flowers"){
          arr2[i]=["books","the sun and her flowers",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"sun"});
  });}else{
    res.render("login",{wrong:"You Must login in first"});
  }
});
app.get("/sport-tennis",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="sports" && arr[i][1]=="tennis racket"){
        flag=true;
      }
    }
    var object=["sports","tennis racket",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="sports" && arr2[i][1]=="tennis racket"){
          arr2[i]=["sports","tennis racket",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"tennis"});
  });}else{
    res.render("login",{wrong:"You Must login in first"});
  }
});
app.get("/sport-boxing",function(req,res){
  if(req.session.name){var query=Cart.find({username:req.session.name});
  query.exec(function(err,result){
    if(err) throw err;
    var i=0;
    var count=1;
    var arr=result[0].list;
    var arr2=[];
    var flag=false;
    for(i=0;i<arr.length;i++){
      arr2=arr2.concat([arr[i]]);
      if(arr[i][0]=="sports" && arr[i][1]=="boxing bag"){
        flag=true;
      }
    }
    var object=["sports","boxing bag",1];
    if(arr2.length==0 || flag==false){
      arr2=arr2.concat([object]);
    }else{
      for(i=0;i<arr2.length;i++){
        if(arr2[i][0]=="sports" && arr2[i][1]=="boxing bag"){
          arr2[i]=["sports","boxing bag",arr2[i][2]+1];
        }
      }
    }
    Cart.findOneAndUpdate({username:req.session.name,list:arr},{username:req.session.name,list:arr2},{upsert:true},function(err,doc){
      if(err) throw err;
    });
    res.render("temp",{done:"boxing"});
  });}else{
    res.render("login",{wrong:"You must login first"});
  }
});
app.post("/",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;
  var query=User.find({"username":user,"password":pass});
  query.exec(function(err,result){
    if (err) throw err;
    if(result.length==0){
      res.render("login",{wrong:"Wrong user name or passowrd"});
    }else{
      name=user;
      req.session.name=user;
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
  app.listen(3000);
}