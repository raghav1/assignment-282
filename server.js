

var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");

////Called all dependencies///Now lets use them

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var mysql = require('mysql');

var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWSAcessKeyId,
    secretAccessKey: process.env.AWSSecretkey,
    region: "us-west-1"
});


//this does not look like my code
// Using dynamo local
dynam = new AWS.DynamoDB();


var vogels = require('vogels');
vogels.dynamoDriver(dynam);
//Checking to see if tables exist
dynam.listTables(function(err, data) {
    console.log('listTables', err, data);
    calls(err, data);
}, calls);

/**ALL MY MODELS**/
var catalog = vogels.define('catalog', function(schema) {
    schema.String('name', {
        hashKey: true
    });
    schema.String('description');
});

var Items = vogels.define('item', function(schema) {
    schema.String('name', {
        hashKey: true
    });
    schema.String('catalog');
    schema.String('description');
    schema.Number('quantity');
    schema.Number('cost');

});

var cart = vogels.define('cart', function(schema) {
    schema.Number('id', {
        hashKey: true
    });
    schema.String('item', {rangeKey: true});
    schema.String('quantity');
    schema.String('cost');

})

function calls(err, data) {
    if (err) {
        console.log("err");
    } else if (data.TableNames.length > 1000) {
        callback();
    } else {
        var call = vogels.createTables({
            'catalog': {
                readCapacity: 1,
                writeCapacity: 1
            },
            'item': {
                readCapacity: 1,
                writeCapacity: 1
            },
            'cart': {
                readCapacity: 1,
                writeCapacity: 1
            }
        }, function(err) {
            if (err) {
                console.log('Error in creating tables', err);
            } else {
                console.log('table are now created and active');
                callback();
            }
        }, callback);

    }

};

var mysql      = require('mysql');
var db=require("/srv/www/cmpe282/shared/config/opsworks");
db.db.user="root";
var connection = mysql.createConnection(db.db);

connection.connect();


var router=express.Router();
router.route('/signup')

.post(function(req,res)
{
	connection.query('INSERT INTO signup (Firstname,Lastname,username,pass) VALUES(?,?,?,?)',[req.body.Firstname,req.body.Lastname,req.body.username,req.body.pass],(function(err,rows,fields){
		if(err)
		{
			res.send(err);
		}
		else
		{
			res.json({message:"you are sucessfully registered"});

		}
	})
  )


	})


router.route('/payment')

.post(function(req,res)
{
  connection.query('INSERT INTO payment (id,amount,cardno) VALUES(?,?,?)',[req.body.id,req.body.amount,req.body.cardno],(function(err,rows,fields){
    if(err)
    {
      res.send(err);
    }
    else
    {
      res.json({message:"Payment Suessfully done "});

    }
  })
  )
    
    
  });
router.route('/login')
.post(function(req,res)
{
	console.log('SELECT * FROM signup where username like "'
        + req.body.username+'" and pass like "'+ req.body.pass+
        '"');
	connection.query('SELECT * FROM signup where username like "'
        + req.body.username+'" and pass like "'+ req.body.pass+
        '"', function(err, rows, fields) {
                if (err) {
                      res.json(err);
                }
                else
                if(rows.length>0)
                    {
                    	var query='Update signup set lastlogin= NOW() where id= '+parseInt(rows[0].id);
                      console.log(query);
                    	connection.query(query, function(err, row, fields){
                                if (err) {
                                    res.json(err);
                                }
                                else{
                                  res.json(rows);
                                }
                          });



                    }
                else
                {

                  res.json({message:"Invalid Login"});
                }


            });
	 //connection.release();
});
router.route('/cart/:id')
.post(function(req,res){
   var cat = new cart({
            id:req.params.id,
            item: req.body.item,
            quantity: req.body.quantity,
            cost:req.body.cost
        });
        cat.save(function(err,re)
        {console.log(err);
            console.log('created account in DynamoDB');
            if (err) {
                res.send(err);
            } else {
                  res.send("<script>window.location.href = '/main';</script>");
            }
        });
})
.get(function(req,res){
cart.scan()
            .limit(50)
            .where('id').equals(req.params.id)
            .loadAll()
            .exec(function(err, resp) {
                if (err) {
                    res.send('Error running scan', err);
                } else {

                    res.send(resp);


                }
            });
});








var callback = function() {
     var fileData=""
     fs = require('fs')
     fs.readFile('./public/dynamo.js', 'utf8', function (err,data) {
       if (err) {
         return console.log(err);
       }

  startBatchWrite(data);
});
};
var startBatchWrite=function(fileData){


var param=require("./public/dynamo");



dynam.batchWriteItem(param, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
    app.use(express.static(__dirname + '/public'));
    app.use('/user', router);

    app.set('port', 80);
   // http.createServer(app).listen(app.get('port'), function() {
     //   console.log('Express server listening on port ' + app.get('port'));
    //});
    exports = module.exports = app;
};

router.route('/catalog')
    .get(function(req, res) {
        catalog
            .scan()
            .limit(50)
            .loadAll()
            .exec(function(err, resp) {
                if (err) {
                    res.send('Error running scan', err);
                } else {

                    res.send(resp);

                    if (resp.ConsumedCapacity) {

                        res.send('Scan consumed: ', resp.ConsumedCapacity);
                    }
                }
            });

    });

router.route('/catalog')
    .post(function(req, res) {

        var acc = new catalog({
            name: req.body.name,
            description: req.body.description
        });
        acc.save(function(err)
        {
            console.log('created account in DynamoDB');
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: "Success"
                });
            }
        });
    });



router.route('/item')
    .post(function(req, res) {
        var item = new Items({
            name: req.body.name,
            description: req.body.description,
            catalog: req.body.catalog,
            quantity: req.body.quantity,
            cost: req.body.cost
        });
        console.log(item);
        item.save(
            function(err, item) {
                console.log('created account in DynamoDB');
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "Success",
                        item: item
                    });
                }
            }
        );
    })
    .delete(function(req, res) {
        Items.destroy(req.body.name, function(err) {
            if (err)
                res.send(err);
            else {
                res.json({
                    message: "Success"
                });
            }
        });
    })
router.route('/item')
    .get(function(req, res) {
        Items
            .scan()
            .limit(20)
            .loadAll()
            .exec(function(err, resp) {
                if (err) {
                    res.send('Error running scan', err);
                } else {

                    res.send(resp);

                    if (resp.ConsumedCapacity) {

                        res.send('Scan consumed: ', resp.ConsumedCapacity);
                    }
                }
            });
    });


router.route('/:catalog')
    .get(function(req, res) {
        Items

            .scan()
            .where('catalog').eq(req.params.catalog)
            .returnConsumedCapacity()

        .exec(function(err, resp) {
            if (err) {
                res.send('Error running scan', err);
            } else {

                res.send(resp);

                if (resp.ConsumedCapacity) {

                    res.send('Scan consumed: ', resp.ConsumedCapacity);
                }
            }
        });
    });


/*
mongoose.connect('mongodb://localhost:27017/application'); // Connection between application and database//

// using the bear model//

var Bear=require('./app/models/bear');


var router=express.Router();
router.route('/bears')
.post(function (req,res){////Insert statement in the database//
	var bear= new Bear();
	bear.name={'first':req.body.firstname,'last':req.body.lastname};
	bear.age=req.body.age;
	console.log(bear);
	bear.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Record created"});
		}
	})


})
.get(function(req,res){
	Bear.find(function(err,abc){// This is Select Statement//
		if(err){
			res.send(err);
		}
		else
			{
				res.json(abc);
			}
	})
});
	router.route('/bear/:bearid')/////// localhost:8080/api/bear/2354135425343254
.get(function(req,res){
	Bear.findById(req.params.bearid,function(err,bear){
	if (err)
			res.send(err);
		else
			res.json(bear);
	})

})
.put(function(req,res){
	Bear.findById(req.params.bearid,function(err,bear){
		if(err)
			res.send(err);
		else
			bear.name={'first':req.body.firstname,'last':req.body.lastname};
	bear.age=req.body.age;
	console.log(bear);
	bear.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Record updated"});
		}

	})
});
})
.delete(function(req,res){
	Bear.remove({_id:req.params.bearid},function(err,bear){
		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Record deleted"});
		}
	});
});
// Catalog//
var Catalog=require('./app/models/catalog');

router.route('/catalog')
.post(function (req,res){////Insert statement in the database//
	var catalog= new Catalog();
	catalog.name=req.body.name;
	console.log(catalog);
	catalog.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"New Catalog Created"});
		}
	})


})
.get(function(req,res){
	Catalog.find(function(err,cde){// This is Select Statement//
		if(err){
			res.send(err);
		}
		else
			{
				res.json(cde);
			}
	})
});
//try nowsave kar

	router.route('/catalog/:catalog_id')/////// localhost:8080/api/catalog/2354135425343254
.get(function(req,res){
	Catalog.findById(req.params.bearid,function(err,catalog){
	if (err)
			res.send(err);
		else
			res.json(catalog);
	})

})

.put(function(req,res){
	Catalog.findById(req.params.catalog_id,function(err,catalog){
		if(err)
			res.send(err);
		else
			catalog.name=req.body.name;
	console.log(catalog);
	bear.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Catalog Name Updated"});
		}

	})
});
})
.delete(function(req,res){
	Catalog.remove({_id:req.params.catalog_id},function(err,catalog){
		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Catalog deleted"});
		}
	});
});


// Item //
var Item=require('./app/models/item');
router.route('/item')
.post(function (req,res){////Insert statement in the database//
	var item= new Item();
	item.name=req.body.name;
	item.catageory=req.body.catageory;
	item.description=req.body.description;
	item.quantity=req.body.quantity;
	item.price=req.body.price;
	console.log(item);
	item.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"New Item Created"});
		}
	})


})
.get(function(req,res){
	Item.find(function(err,abc){// This is Select Statement//
		if(err){
			res.send(err);
		}
		else
			{
				res.json(abc);
			}
	})
});
	router.route('/item/:itemid')/////// localhost:8080/api/bear/2354135425343254
.get(function(req,res){
	Item.findById(req.params.itemid,function(err,item){
	if (err)
			res.send(err);
		else
			res.json(item);
	})

})
.put(function(req,res){
	Item.findById(req.params.itemid,function(err,item){
		if(err)
			res.send(err);
		else
			item.name=req.body.name;
	item.catageory=req.body.catageory;
	item.description=req.body.description;
	item.quantity=req.body.quantity;
	item.price=req.body.price;
	console.log(item);
	item.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Item Updated "});
		}
	})
});
})
.delete(function(req,res){
	Catalog.remove({_id:req.params.itemid},function(err,item){
		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Item deleted"});
		}
	});
});


// Credit Card


var CCdetails=require('./app/models/ccdetails');


var router=express.Router();
router.route('/ccdetails')
.post(function (req,res){////Insert statement in the database//
	var ccdetails= new CCdetails();
	ccdetails.name={'first':req.body.firstname,'last':req.body.lastname};
	ccdetails.Expirationdate=req.body.Expirationdate;
	ccdetails.code=req.body.code;
	ccdetails.billingaddress=req.body.billingaddress;
	ccdetails.zipcode=req.body.zipcode;
	ccdetails.city=req.body.city;
	ccdetails.state=req.body.state;

	ccdetails.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Thanks for Transcation"});
		}
	})


})
.get(function(req,res){
	CCdetails.find(function(err,abc){// This is Select Statement//
		if(err){
			res.send(err);
		}
		else
			{
				res.json(abc);
			}
	})
});
	router.route('/ccdetails/:ccdetails_id')/////// localhost:8080/api/bear/2354135425343254
.get(function(req,res){
	Bear.findById(req.params.bearid,function(err,ccdetails){
	if (err)
			res.send(err);
		else
			res.json(ccdetails);
	})

})
.put(function(req,res){
	CCdetails.findById(req.params.ccdetails_id,function(err,ccdetails){
		var ccdetails= new CCdetails();
	ccdetails.name={'first':req.body.firstname,'last':req.body.lastname};
	ccdetails.Expirationdate=req.body.Expirationdate;
	ccdetails.code=req.body.code;
	ccdetails.billingaddress=req.body.billingaddress;
	ccdetails.zipcode=req.body.zipcode;
	ccdetails.city=req.body.city;
	ccdetails.state=req.body.state;

	ccdetails.save(function(err){

		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Credit Card Details Changed"});
		}
	})
});
})
.delete(function(req,res){
	CCdetails.remove({_id:req.params.ccdetails_id},function(err,ccdetails){
		if(err)
			{
				res.send(err);
			}
		else{
			res.json({message:"Record deleted"});
		}
	});
});
*/


app.use(express.static(__dirname+"/htmlfiles"));
app.get('/',function(req,res){
	res.sendfile("./htmlfiles/Signup.html");
});
app.get('/login',function(req,res){
  res.sendfile("./htmlfiles/signin.html");
});
app.get('/main',function(req,res){
  res.sendfile("./htmlfiles/main.html");
});

app.get('/Catalog',function(req,res){
  res.sendfile("./htmlfiles/abc.html");
});
app.get('/Additem',function(req,res){
  res.sendfile("./htmlfiles/additem.html");
});
app.get('/payment',function(req,res){
  res.sendfile("./htmlfiles/CCdetails.html");
});




app.use('/api',router);

// This should be in the end//
var port=process.env.PORT||8080;
app.listen(port);
