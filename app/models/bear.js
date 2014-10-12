var mongoose=require("mongoose");
var myschema= new mongoose.Schema({
	name:
	{
		first:String,
		last:String
	},
	age:
	{
		type:Number
	}


});
module.exports=mongoose.model('bear',myschema);