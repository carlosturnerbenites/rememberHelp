const express = require('express'),
	router = express.Router(),
	models = require('./../models/'),
	utils = require('./../utils/'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	upload = multer({ dest: 'public/images/users' })

router.use(bodyParser.json())

router.get('/collections',(req,res) => {
	res.render('collections/index',{models: utils.models,numberOfCollections: Object.keys(utils.models).length})
})

router.get('/check-in', (req, res) => res.render('users/checkIn',{statesHealth : utils.statesHealth}))

router.post(
	'/check-in',
	upload.any(),
	(req, res) => {
		var data = req.body,
			dataNewChildren = {
				id : data.idChildren,
				password: data.passwordChildren,
				type: 1,
				username: data.usernameChildren,
				email: data.email
			},
			dataNewFamily = {
				id: data.idFamily,
				password: data.passwordParent,
				type: 0,
				username: data.usernameParent,
				email: data.email
			}

		var photoChildren = req.files.find(file => {return file.fieldname == 'photoChildren'}) ,
			photoParent = req.files.find(file => {return file.fieldname == 'photoParent'})

		dataNewChildren.photo = photoChildren ? photoChildren.filename : 'unkown.png'
		dataNewFamily.photo = photoParent ? photoParent.filename : 'unkown.png'

		if (dataNewChildren.username == dataNewFamily.username) return {err : {msg: 'User Duplicate'}}

		models.user.create(dataNewChildren, (err, userChildren) => {
			if (err) return res.json({err: err})

			dataNewChildren.user = userChildren._id
			dataNewChildren.age = data.ageChildren
			dataNewChildren.stateHealth = data.stateHealth
			dataNewChildren.name = data.nameChildren

			models.children.create(dataNewChildren, (err,newChildren) => {
				if (err) return res.json({err: err})

				models.parent.findOne({id : data.idFamily},(err,family) => {
					if (err) return res.json({err: err})

					if(family) {
						family.update({ $push : {children: newChildren}}, (err) => {
							if (err) return res.json({err: err})
							models.children.findOneAndUpdate({_id : newChildren._id}, {$set : { parent : family._id}}).exec()
							return res.redirect('/admin/check-in')
						})

					}else {
						models.user.create(dataNewFamily, (err, user) => {
							if (err) return res.json({err: err})

							dataNewFamily.user = user._id
							dataNewFamily.children = [newChildren]
							dataNewFamily.name = data.nameParent

							models.parent.create(dataNewFamily, (err,parent) => {
								if (err) return res.json({err: err})
								models.children.findOneAndUpdate({_id : newChildren._id}, {$set : { parent : parent._id}}).exec()
								return res.redirect('/admin/check-in')
							})
						})
					}
				})

			})
		})
	})

module.exports = router
