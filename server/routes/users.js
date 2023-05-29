var express = require('express');
var router = express.Router();
var { poolDbUsers } = require('../queries');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  // faccio una query al database degli utenti per verificare le credenziali
  //                      Testato facendo:
  // curl -d "customer_id=2&userpassword=test" -X POST http://localhost:3000/users
  // curl -d "customer_id=2&userpassword=PASSWORDSBAGLIATA" -X POST http://localhost:3000/users

    console.log('Body ricevuto: ', req.body);
  let username = req.body.username;
  let password = req.body.userpassword;
  let customer_id = req.body.customer_id;

  q = "SELECT * " +
    " FROM utenti " +
    " WHERE customer_id=$1 AND userpassword=$2"

  poolDbUsers.query(q, [customer_id, password] )
    .then((outputQuery) => {
      if (outputQuery.rows.length === 1){
        res.status(200).json({message: "Credenziali corrette."})
      }
      else{
        res.status(200).json({message: "Credenziali errate oppure non esiste l'utente specificato"})
      }
    })
    .catch((error) => {
      res.status(500).json({error: error.toString()})
    });

});



module.exports = router;
