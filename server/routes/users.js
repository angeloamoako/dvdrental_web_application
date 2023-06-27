var express = require('express');
var router = express.Router();
var { poolDbUsers } = require('../queries');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  console.log('Body ricevuto: ', req.body);
  let password = req.body.userpassword;
  let customer_id = req.body.customer_id;

  q = "SELECT * " +
    " FROM utenti " +
    " WHERE customer_id=$1 AND userpassword=$2"

  poolDbUsers.query(q, [customer_id, password] )
    .then((outputQuery) => {
      if (outputQuery.rows.length === 1){
        const firstName = outputQuery.rows[0].firstname;
        const lastName = outputQuery.rows[0].lastname;
        //console.log("Nome dell'utente: ", firstname);
        //console.log("Cognome dell'utente: ", lastname);
        res.status(200).json({message: "Credenziali corrette.", firstName: firstName, lastName: lastName})
      }
      else{
        res.status(400).json({message: "Credenziali errate oppure non esiste l'utente specificato"})
      }
    })
    .catch((error) => {
      res.status(500).json({error: error.toString()})
    });

});

module.exports = router;
