import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductService } from '../Services/add-product.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent {

  Data:any = [];
  baseImageUrl = 'https://localhost:7203';

constructor(private route:Router, private ProductList:AddProductService){

}

  About() {
    this.route.navigate(['/About'])
  }
  Home() {
    this.route.navigate(['/Home'])
  }
  AddProduct() {
    this.route.navigate(['/Add Product'])
  }
  AllProduct(){
    this.route.navigate(['/All Product'])
  }
  Submit() {
    this.route.navigate(['/Submit'])
  }

  ngOnInit(): void {
    this.ProductList.users().subscribe((result: any)=>{
      console.warn(result)
      this.Data = result.data;
      
    })
  
  }
}
  

