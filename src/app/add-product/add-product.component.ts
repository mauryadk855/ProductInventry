import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductService } from '../Services/add-product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  Productdata: any = [];
  attachments: any = '';

  ProductForm = new FormGroup({
    ProductName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    ProductCategory: new FormControl('', [Validators.required]),
    ProductFresheness: new FormControl(''),
    ImageofProduct: new FormControl(''),
    ProductBrand: new FormControl('', [Validators.required]),
    Manufacturer: new FormControl('', [Validators.required]),
    ProductPrice: new FormControl(0, [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    Comment: new FormControl('', [Validators.required]),
  });



  constructor(private route: Router, private AddProductData: AddProductService) {

    this.AddProductData.categorydata().subscribe((result: any) => {
      console.log(result);
      if (result.status == "success") {
        this.Productdata = result.data;
        console.log(this.Productdata);
      }
      else {
        this.Productdata = [];
      }
    });
  }
  ngOnInit(): void {
    this.InitForm();
  }

  InitForm() {
    this.ProductForm.patchValue({
      ProductName: '',
      ProductCategory: '',
      ProductFresheness: '',
      ImageofProduct: '',
      ProductBrand: '',
      Manufacturer: '',
      Comment: '',
      Description: '',
      ProductPrice: 0,
    })
  }

  get f() {
    return this.ProductForm.controls;
  }
  // changeCategory(e: any) {
  //   console.log(e.target.value);
  // }


  Home() {
    this.route.navigate(['/Home'])
  }
  AllProduct() {
    this.route.navigate(['/All Product'])
  }
  AddProduct() {
    this.route.navigate(['/Add Product'])
  }
 





  // getusersData(data: any) {
  //   var req = {

  //   };
  //   this.AddProductData.saveusers(req).subscribe((result: any) => {


  //   })
  // }

  onSubmit() {
    
    if (this.ProductForm.valid) {
      this.upload().then(res=>{
        var req = {
          "Product_Name": this.ProductForm.value['ProductName'],
          "Product_Category": this.ProductForm.value['ProductCategory'],
          "product_Fresheness": this.ProductForm.value['ProductFresheness'],
          "image_of_Product": res,
          "product_Brand": this.ProductForm.value['ProductBrand'],
          "manufacturer": this.ProductForm.value['Manufacturer'],
          "product_Price": this.ProductForm.value['ProductPrice'],
          "additional_Description": this.ProductForm.value['Description'],
          "comment": this.ProductForm.value['Comment']
        }
        this.AddProductData.saveusers(req).subscribe((result: any) => {
          alert(result.description);
          if (result.status == "success") {
            this.ProductForm.reset();
            this.InitForm();
          }
        })
      })      
    }
  }

  detectFiles(event: any) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          var mimeType = file.type;
          if (mimeType.match(/image\/*/) != null) {

          }          
          else {
            alert('Invalid file has been selected...!!!');            
            (document.getElementById("attachments") as HTMLFormElement)['value'] = null;
          }
        }
        reader.readAsDataURL(file);
      }
    }
  }

  upload(): Promise<string> {
    return new Promise(resolve => {
      var name: any = document.getElementById('attachments');
      if (name.files.length > 0) {
        var temp = <File>name.files.item(0);
        const formData = new FormData();
        formData.append('file', <File>name.files.item(0), temp.name);
        this.AddProductData.imgusers(formData).subscribe((result: any) => {
          this.attachments = result.data;
          resolve(result.data);
        })
      }
      else {
        resolve('');
      }
    })
  }
}

