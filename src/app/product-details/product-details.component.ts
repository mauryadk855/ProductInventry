import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddProductService } from '../Services/add-product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var window:any;


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  Productdata: any = [];
  attachments: any = '';
  baseImageUrl = 'https://localhost:7203';
  Data: any = [];
  modelAction: any = 'Add';
  formModel:any;
  

  ProductForm = new FormGroup({
    ProductName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    HSNCODE: new FormControl('', [Validators.required]),
    item_code: new FormControl('', [Validators.required]),
    ProductCategory: new FormControl('', [Validators.required]),
    MRP: new FormControl(0, [Validators.required]),
    ImageofProduct: new FormControl(''),
    OtherImage: new FormControl(''),
    ProductBrand: new FormControl('', [Validators.required]),
    Manufacturer: new FormControl(''),
    SalePrice: new FormControl(0.00, [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    Unit: new FormControl(''),
    TaxIncluded: new FormControl('', [Validators.required]),
  })

  DetailsProductForm = new FormGroup({

    'Id': new FormControl(0),
    'ProductName': new FormControl(''),
    'HSNCODE': new FormControl(''),
    'item_code': new FormControl(''),
    'ProductCategory': new FormControl(''),
    'MRP': new FormControl(''),
    'ImageofProduct': new FormControl(''),
    'OtherImage': new FormControl(''),
    'ProductBrand': new FormControl(''),
    'Manufacturer': new FormControl(''),
    'SalePrice': new FormControl(''),
    'Description': new FormControl(''),
    'Unit': new FormControl(''),
    'TaxIncluded': new FormControl(''),
  })

  constructor(private route: Router, private AddProductData: AddProductService, private router: ActivatedRoute,) { }



  Home() {
    this.route.navigate(['/Home'])
  }
  AddProduct() {
    this.route.navigate(['/AddProduct'])
  }
  AllProduct() {
    this.route.navigate(['/AllProduct'])
  }

  OtherImages: any = [];
  id = '';
  ngOnInit(): void {
    this.router.params.subscribe((params: any) => {
      this.id = params['id']
    })
    if (this.id != undefined && this.id != '' && this.id != null) {
      this.AddProductData.getproductByID(this.id).subscribe((result: any) => {
        console.log(result);
        this.modelAction = "update";
        this.DetailsProductForm.patchValue({
          Id: parseInt(this.id),
          ProductName: result.data.product_Name,
          HSNCODE: result.data.hsN_CODE,
          item_code: result.data.item_Code,
          ProductCategory: result.data.product_Category,
          MRP: result.data.mrp,
          ImageofProduct: result.data.image_of_Product,
          OtherImage: result.data.other_Image,
          ProductBrand: result.data.product_Brand,
          Manufacturer: result.data.manufacturer,
          SalePrice: result.data.sale_Price,
          Description: result.data.additional_Description,
          Unit: result.data.unit,
          TaxIncluded: result.data.tax_Included,


        })
        this.OtherImages = result.data.other_Image.split(',')
      })
    }
   

  }

openModel(){
  this.formModel.show();
}
dosomthing(){
  this.formModel.hide();
}


  InitForm() {
    this.ProductForm.patchValue({
      ProductName: '',
      HSNCODE: '',
      item_code: '',
      ProductCategory: '',
      MRP: 0,
      ImageofProduct: '',
      OtherImage: '',
      ProductBrand: '',
      Manufacturer: '',
      SalePrice: 0,
      Description: '',
      Unit: '',
      TaxIncluded: '',
    })
  }



  View() {
    if (this.DetailsProductForm.valid) {
      this.upload().then(res => {
        this.uploadOther().then(other_res => {
          var req = {
            "Product_Name": this.DetailsProductForm.value['ProductName'],
            "Product_Category": this.DetailsProductForm.value['ProductCategory'],
            "HSN_CODE": this.DetailsProductForm.value['HSNCODE'],
            "item_code": this.DetailsProductForm.value['item_code'],
            "MRP": this.DetailsProductForm.value['MRP'],
            "image_of_Product": res != '' ? res : this.DetailsProductForm.value['ImageofProduct'],
            "Other_Image": other_res != '' ? other_res : this.DetailsProductForm.value['OtherImage'],
            "product_Brand": this.DetailsProductForm.value['ProductBrand'],
            "manufacturer": this.DetailsProductForm.value['Manufacturer'],
            "SalePrice": this.DetailsProductForm.value['SalePrice'],
            "additional_Description": this.DetailsProductForm.value['Description'],
            "Unit": this.DetailsProductForm.value['Unit'],
            "TaxIncluded": this.DetailsProductForm.value['TaxIncluded'],
          }
          this.route.navigate(['/AllProduct'])
          this.AddProductData.saveusers(req).subscribe((result: any) => {
            alert(result.description);
            if (result.status == "success") {
              this.ProductForm.reset();
              this.InitForm();
            }
          })
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

  OtherAttachments: any = [];
  async uploadOther() {
    return new Promise(async resolve => {
      var name: any = document.getElementById('otherattachments');
      if (name.files.length > 0) {
        for (let index = 0; index < name.files.length; index++) {
          var res = await this.uploadfile(<File>name.files.item(index));
          if (index == name.files.length - 1) {
            console.log(this.OtherAttachments.join(','));
            resolve(this.OtherAttachments.join(','));
          }
        }
      }
      else {
        resolve('');
      }
    })
  }
  async uploadfile(file: any): Promise<string> {
    return new Promise(resolve => {
      var temp = file;
      const formData = new FormData();
      formData.append('file', file, temp.name);
      this.AddProductData.imgusers(formData).subscribe((result: any) => {
        this.OtherAttachments.push(result.data);
        resolve(result.data);
      })

    })
  }

  imgUrl='';

    displayStyle = "none";
  
    viewImage(image:any) {
      this.imgUrl = image;
      this.displayStyle = "block";
    }
    closePopup() {
      this.displayStyle = "none";
    }
    
}

  
  

 

