var mongoose=require("mongoose");
var myschema= new mongoose.Schema({
	name:
	{
		first:String,
		last:String
	},
	Expirationdate:
	{
		type:Date
	},
	Code:
	{
		type:Number
	},
	Zipcode:
	{
		type:Number
	},
	billingaddress:
	{
		type:String
	},
	City:
	{
		type:String
	},
	State:
	{
		type:String
	}


});
module.exports=mongoose.model('ccdetails',myschema);