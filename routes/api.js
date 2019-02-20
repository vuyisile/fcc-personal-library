/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var babel =  require('babel-core')

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    MongoClient.connect(MONGODB_CONNECTION_STRING , {useNewUrlParser: true},function(err, client) {
      var dbCollection = client.db('anedb').collection('books');
     dbCollection.find().toArray((err,result)=>{
       if(err) throw err
       console.log('result',result);
       res.json(result).end();
     })
    });
    
  })
    
    .post(function (req, res){
      var title = req.body.title;
      var book = {"title":title, comments:[],commentcount:0,created_on:new Date()}
      if(title.length <= 0){
      res.send('no text entered!');
      }else{
        MongoClient.connect(MONGODB_CONNECTION_STRING ,{useNewUrlParser: true }, function(err, client) {
          var db = client.db('anedb');
          db.collection('books').insertOne({...book},function(err,doc){
            if (err) console.log(err)
            res.json(book);
          });
        });
      }
    })
    
    .delete(function(req, res){
        MongoClient.connect(MONGODB_CONNECTION_STRING , {useNewUrlParser: true},function(err, client) {
         var dbCollection = client.db('anedb').collection('books');
         dbCollection.deleteMany()
         })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING , {useNewUrlParser: true},function(err, client) {
      var dbCollection = client.db('anedb').collection('books');
     dbCollection.find({_id:ObjectId(bookid)}).toArray((err,result)=>{
       if(err) throw err
       console.log('result',result);
       res.json(result[0]).end();
     })
    });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      console.log('comment',bookid+': '+comment)
  
     MongoClient.connect(MONGODB_CONNECTION_STRING , {useNewUrlParser: true},function(err, client) {
         var dbCollection = client.db('anedb').collection('books');
         dbCollection.findOne({_id:ObjectId(bookid)},function(err,doc){
           if(err)throw err;
           console.log('save',doc)
           doc.comments.push(comment);
           doc.commentcount+=1;
           dbCollection.save(doc,(err,result)=>{
           if(err)throw err;
           console.log('result',result)
           res.json(doc)
            })
           })
         })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING , {useNewUrlParser: true},function(err, client) {
         var dbCollection = client.db('anedb').collection('books');
         dbCollection.findOneAndDelete({_id:ObjectId(bookid)},function(err,doc){
           if(err)throw err;
           console.log('successfully deleted',doc)
           res.send("delete successful");
           })
         })
    });
  
};
