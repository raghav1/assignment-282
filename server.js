

var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");

////Called all dependencies///Now lets use them

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



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

var mysql = require('mysql');
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

    app.set('port', process.env.PORT || 3000);
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



app.use(express.static(__dirname+"/htmlfiles"));
app.get('/',function(req,res){
	res.sendfile("./htmlfiles/Signup.html");
});
app.get('/login',function(req,res){
  res.sendfile("./htmlfiles/Signin.html");
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
app.get('/Vieworder',function(req,res){
res.sendfile("./htmlfiles/viewcart.html")
});




app.use('/api',router);

// This should be in the end//
var port=80;
app.listen(port);
