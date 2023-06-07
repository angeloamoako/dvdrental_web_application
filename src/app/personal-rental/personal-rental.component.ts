import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-rental',
  templateUrl: './personal-rental.component.html',
  styleUrls: ['./personal-rental.component.css']
})
export class PersonalRentalComponent {
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
}
