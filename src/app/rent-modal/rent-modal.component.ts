import { Component } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-rent-modal',
  templateUrl: './rent-modal.component.html',
  styleUrls: ['./rent-modal.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule]
})
export class RentModalComponent {
  myFilter(data: Date | null): boolean {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    var after_tomorrow = new Date();
    after_tomorrow.setDate(today.getDate() + 2);

    // Tronca le date al formato "yyyy-mm-dd" per facilitare il confronto
    let dataCorrente = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let dataDomani = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    let dataDopodomani = new Date(after_tomorrow.getFullYear(), after_tomorrow.getMonth(), after_tomorrow.getDate());

    const tdata = data ? new Date(data.getFullYear(), data.getMonth(), data.getDate()) : null;
    // Confronta la data con la data corrente, domani e dopodomani
    return (tdata === null || tdata.getTime() === dataCorrente.getTime() || tdata.getTime() === dataDomani.getTime() || tdata.getTime() === dataDopodomani.getTime());
  }

}
