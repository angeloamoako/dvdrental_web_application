import express, { Request, Response } from 'express';
import queries from './queries.js';
import jwt from  'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  let password = req.body.userpassword;
  let customer_id = req.body.customer_id;
  let hashedPassword = crypto.createHash('md5').update(password).digest('hex');

  console.log("Body ricevuto: ", req.body);

  const q = "SELECT * " +
    " FROM utenti " +
    " WHERE customer_id=$1 AND userpassword=$2"

  queries.poolDbUsers.query(q, [customer_id, hashedPassword])
    .then((outputQuery) => {
      if (outputQuery.rows.length === 1) {
        const firstName = outputQuery.rows[0].firstname;
        const lastName = outputQuery.rows[0].lastname;

        const userInfo = {
          cId: customer_id,
          fName: firstName,
          lName: lastName
        }

        /* se l'autenticazione va a buon fine genero un token di autenticazione */
        jwt.sign({ user: userInfo}, process.env.SECRET_PASSWORD, {expiresIn: '1h'}, (err, token) => {
          console.log("Token emesso: ", token);
          res.status(200).json({ message: "Credenziali corrette.", firstName: firstName, lastName: lastName, authToken: token });
        });
      } else {
        res.status(400).json({ message: "Credenziali errate oppure non esiste l'utente specificato" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.toString() });
    });
});

export default router;
