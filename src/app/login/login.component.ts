import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  customer_id: any;
  password: any;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const loginData = {customer_id: 2, userpassword: "test"};
    this.http.post('/localhost:3000/users', loginData).subscribe(
      (response) => {
        // Gestisci la risposta dal server
        // Esegui azioni come reindirizzamento a una nuova pagina
      }
    );
  }
}

