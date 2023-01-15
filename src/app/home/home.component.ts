import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private route:Router){
  }
  About() {
    this.route.navigate(['/About'])
  }
  Home() {
    this.route.navigate(['/Home'])
  }
  AddProduct() {
    this.route.navigate(['/AddProduct'])
  }
  AllProduct() {
    this.route.navigate(['/AllProduct'])
  }
}
