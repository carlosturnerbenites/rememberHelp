var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema

const childrenSchema = new Mongoose.Schema({
		name: {type:String, required:true},
		age: {type:Number, min:5},
		father: { type: Schema.ObjectId, ref: 'father' }
	}),
	fatherSchema = new Mongoose.Schema({
		name: {type:String, default:''},
		children: { type: Schema.ObjectId, ref: 'children' }
	}),
	activitySchema = new Mongoose.Schema({
		date : {type:Date},
		hour : {type:Date},
		dateMax : {type:Date},
		text : {type:String, default:''},
		textSpeech : {type:String, default:''},
		img : {type:String, default:''},
		state : {type:String, default:'inprocess'},
		/* la tolerancio se define en minutos*/
		tolerance : {type:Number, default: 20 }
	}),
	messageSchema = new Mongoose.Schema({
		type: {type:Number},
		text : {type:String, default:''}
	}),
	historySchema = new Mongoose.Schema({
		children: { type: Schema.ObjectId, ref: 'children' } ,
		activity: { type: Schema.ObjectId, ref: 'activities' } ,
		timeCurrent : {type:Date, default: Date.now}
	})

module.exports = {
	children : Mongoose.model('children', childrenSchema),
	father : Mongoose.model('father', fatherSchema),
	activitie : Mongoose.model('activitie', activitySchema),
	message : Mongoose.model('message', messageSchema),
	history : Mongoose.model('history', historySchema)
}
