const { response } = require('express');
var express = require('express');
var router = express.Router();
const userHelpers=require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, ) {
  let user=req.session.user
  if (req.session.loggedIn) {
    let name=user.Name

    res.render('user/home', {name,user:true})
  } else {
  res.redirect('/login')
    
  }
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
      if (response) {
      res.redirect('/')
        
      } else {
        res.redirect('/signup')
      }
      
    })
})
router.post('/login',(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.loggedIn=true
      req.session.user=response.user
      console.log(response.user);
      res.redirect('/')
      
    } else {
      res.render('user/login',{err:true})
    }
   })
})
router.get('/logout',(req,res)=>{
  req.session.loggedIn = false

 res.redirect('/')
})
module.exports = router;
