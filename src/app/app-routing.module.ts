import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductComponent } from './all-product/all-product.component';
import { BulkProductComponent } from './bulk-product/bulk-product.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [

  {
    path:'',    
    component:AllProductComponent
  },
  {
    path:'AddProduct/:id',    
    component:AddProductComponent
  },
  {
    path:'AddProduct',    
    component:AddProductComponent
  },
  {
    path:'AllProduct',
    component:AllProductComponent
  },
  {
    path:'update',
    component:AllProductComponent
  },
  {
    path:'ProductDetails/:id',
    component:ProductDetailsComponent
  },
  {
    path:'BulkProduct',
    component:AddProductComponent
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
