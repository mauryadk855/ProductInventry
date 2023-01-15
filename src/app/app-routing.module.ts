import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductComponent } from './all-product/all-product.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  {
    path:'',    
    component:HomeComponent
  },
  {
    path:'Add Product',    
    component:AddProductComponent
  },
  {
    path:'All Product',
    component:AllProductComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
