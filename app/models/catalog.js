var mongoose=require("mongoose");
var myschema= new mongoose.Schema({
	name:
	{
		type:String,
	}
	


});
module.exports=mongoose.model('catalog',myschema);