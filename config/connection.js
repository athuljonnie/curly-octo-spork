
const mongoClient = require('mongodb').MongoClient
 const { MongoClient } = require('mongodb');

const state = {
    db :null
}

module.exports.connect = function(done)
    {
   

   const url='mongodb://127.0.0.1:27017'
   
       const dbname = 'userdata'

       mongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology: true},(err, data)=>
       {
        if(err) return done(err)
        
        state.db = data.db(dbname)
        done()
       })
    }

    module.exports.get = function()
    {  
        return state.db
}
