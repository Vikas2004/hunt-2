const express = require('express')
const api = express.Router()
const Model = require('../../models/team.js')
const notfoundstring = 'team not found'
const bodyParser = require('body-parser');
const cons = require('consolidate');
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }));

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall', (req, res) => {
    console.log(`Handling /findall ${req}`)
    Model.find({}, (err, data) => {
        if(err){
            return res.end(notfoundstring)
        }
      res.json(data)
    })
  })
  
  // GET one JSON by ID
  api.get('/findone/:id', (req, res) => {
    console.log(`Handling /findone ${req}`)
    const id = parseInt(req.params.id)
    Model.find({ teamid: id }, (err, results) => {
      if (err) { return res.end(notfoundstring) }
      res.json(results[0])
    })
  })
  
  // RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
api.get('/teams', async (req,res)=>{
  console.log(`Handling GET / ${req}`)
   await Model.find({},(err,data)=>{
        if (err) {
            return res.end('error on create')
        }
        res.locals.teams = data
        console.log(res.locals.teams, "teams are here")
        res.render('team/details', {title: 'team', res})
    })
})

  
// GET create
api.get('/create', (req, res) => {
    console.log(`Handling GET /create ${req}`)
    Model.find({}, (err, data) => {
      res.locals.team = data
      res.locals.team = new Model()
      res.render('team/create')
    })
  })

  // GET /delete/:id
  api.post('/delete/:id',(req, res)=>{
    console.log(`Handling delete/:id ${req}`)
    const id = parseInt(req.params.id)
    Model.remove({teamid:id}).setOptions({single:true}),exec((err, deleted) =>{
        if(err) {
            return res.end(`Could not find the record to delete`)
        }
        console(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
        return res.render(`team/get`)
    })
})


api.get('/edit/:id', (req, res) => {
  console.log(`Handling GET /edit/:id ${req}`)
    const id = parseInt(req.params.id)
    Model.find({ teamid: id }, (err, results) => {
      if (err) { 
          return res.end(`Could not find the record`) 
        }
        console.log(`RETURNING VIEW FOR${JSON.stringify(results)}`)
      res.locals.student = results[0]
      return res.render('team/edit.ejs')
    })
  })

  // RESPOND WITH DATA MODIFICATIONS 

  // POST new

  api.post('/save',(req,res)=>{
      const body = req.body
      const team = new Model(body)
      console.log(team,"body is here")
      team.save((err) => {
          if(err){
              return res.status().json({"msg": err})
            
          }else{
            
            return res.json({
                "error": false,
                data: team
            })
          }
      
      })
  })

// POST update with id
api.post('/save/:id', (req, res) => {
  console.log(`Handling SAVE request ${req}`)
    const id = parseInt(req.params.id)
    console.log(`Handling SAVING ID:${id}`)
    Model.updateOne({teamid: id },
      { 
        // use mongoose field update operator $set
        $set: {
          teamid: parseInt(req.body.teamid),
          teamname: req.body.teamname,
        }
      },
      (err, item) => {
        if (err) { return res.end(`Record with the specified id not found`) }
        console.log(`ORIGINAL VALUES ${JSON.stringify(item)}`)
        console.log(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
        console.log(`SAVING UPDATED team ${JSON.stringify(item)}`)
        return res.redirect('/teamController')
      })
  })

  // DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  console.log(`Handling DELETE request ${req}`)
    const id = parseInt(req.params.id)
    console.log(`Handling REMOVING ID=${id}`)
    Model.remove({ teamid: id }).setOptions({ single: true }).exec((err, deleted) => {
      if (err) { return res.end(`Id not found`) }
      console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
      return res.redirect('/teamController')
    })
  })

module.exports = api