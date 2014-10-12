var mongoose=require("mongoose");
var myschema= new mongoose.Schema({
	name:
	{
		type:String
	},
	Catageory:
	{
		type:String
	},
	description:
	{
		type:String
	},
	Quantity:
	{
		type:Number
	},
	price:
	{
		type:Number
	}
	
//sasuve bthis fileok

});
module.exports=mongoose.model('item',myschema);