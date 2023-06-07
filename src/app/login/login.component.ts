import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  customer_id: any;
  userpassword: any;
  constructor(private router: Router, private httpClient: HttpClient) {}
  headers = new Headers();

  onSubmit() {
    const loginData = {
      customer_id: this.customer_id,
      userpassword: this.userpassword
    };

    console.log('Customer_id:', this.customer_id);
    console.log('Password:', this.userpassword);

    // Send an HTTP POST request to the backend
    this.httpClient.post<any>('http://localhost:3000/users', loginData)
      .subscribe(
        response => {
          //console.log('Login successful:', response);
          const firstName = response.firstName;
          const lastName = response.lastName;
          console.log('firstName:', firstName);
          console.log('lastName:', lastName);
          console.log('Response: ', response);
          this.router.navigate(['/home'], {state: {
            customer_id: this.customer_id, firstName: firstName, lastName: lastName }});
        },
        error => {
          console.log('Login failed:', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
