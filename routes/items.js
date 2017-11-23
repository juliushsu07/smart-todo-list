"use strict";

const express = require('express');
const router = express.Router();
const googleAPI = require('../api/google.js');
const yelpAPI = require('../api/yelp.js');
const omdbAPI = require('../api/omdb.js');



module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("items")
      .then((results) => {
        res.json(results);
      });
  });


  router.post("/", (req, res) => {
    let date = new Date();
    console.log(req.body);
    debugger;
    googleAPI(req.body.name, function(err, category, description){
      if (err){
        res.send('500: error automatically categorizing');
      }
      knex('items').insert([{
          category: category,
          name: req.body.name,
          description: description,
          date_added: date.toISOString().substr(0, 10),
          user_id: 1
        }])
        .then(res.redirect('/'))
        .catch(err => res.send(err));
    });
  });


  // router.post("/:id", (req, res) => {
  //   const category = req.query.category;
  //   console.log("deleted", req.params.id);
  //   knex('items')
  //     .where('name', req.params.id)
  //     .delete()
  //     .then(res.redirect(`/${category}`))
  //     .catch(err => res.send(err));
  // });

  router.delete("/:id", (req, res) => {
    console.log("deleted", req.params.id);
    knex('items')
      .where('name', req.params.id)
      .delete()
      .then(() => {
        res.json({success: true})
      })
      .catch(err => res.send(err));
  });

  router.get('/eat/:name', (req, res) => {
    yelpAPI(req.params.name, (jsonres) => {
      res.send(jsonres)
    })
  })


  router.get('/watch/:name', (req, res) => {
    omdbAPI(req.params.name, (jsonres) => {
      res.send(jsonres)
    })
  })



  return router;
};


