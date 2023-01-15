import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductService } from '../Services/add-product.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  Productdata: any = [];
  attachments: any = '';
  modelAction: any = 'Add';
  url="/assets/Img/no_img.jpg";
  

  baseImageUrl = 'https://localhost:7203';

  ProductForm = new FormGroup({
    ProductName: new FormControl('', [Validators.required, Validators.minLength(3),     Validators.maxLength(200)]),
    HSNCODE:new FormControl('', [Validators.required]),
    item_code:new FormControl('', [Validators.required]),
    ProductCategory: new FormControl('', [Validators.required]),
    MRP: new FormControl(0, [Validators.required,]),
    ImageofProduct: new FormControl(''),
    OtherImage: new FormControl(''),
    ProductBrand: new FormControl('', [Validators.required]),
    Manufacturer: new FormControl(''),
    SalePrice:  new FormControl(0.00, [Validators.required ]),
    Description: new FormControl('', [Validators.required]),
    Unit: new FormControl(''),
    TaxIncluded: new FormControl('', [Validators.required]),
  });

  editproductform = new FormGroup({
    'Id': new FormControl(0),
    'ProductName': new FormControl(''),
    'HSNCODE': new FormControl(''),
    'item_code': new FormControl(''),
    'ProductCategory': new FormControl(''),
    'MRP': new FormControl(0),
    'ImageofProduct': new FormControl(''),
    'OtherImage': new FormControl(''),
    'ProductBrand': new FormControl(''),
    'Manufacturer': new FormControl(''),
    'SalePrice': new FormControl(0.00),
    'Description': new FormControl(''),
    'Unit': new FormControl(''),
    'TaxIncluded': new FormControl(''),

  });


  constructor(private route: Router, private AddProductData: AddProductService, private router: ActivatedRoute) {
    this.AddProductData.categorydata().subscribe((result: any) => {
      if (result.status == "success") {
        this.Productdata = result.data;
      }
      else {
        this.Productdata = [];
      }
    });
  }

  id = '';

  OtherImagesEdit:any=[];

  ngOnInit(): void {
    this.InitForm();
    this.router.params.subscribe((params: any) =>{
      this.id = params['id']
    })
    if (this.id != undefined && this.id != '' && this.id != null) {
      this.AddProductData.getproductByID(this.id).subscribe((result: any) => {
       //  console.log(result);
        this.modelAction = "update";
        this.editproductform.patchValue({
          Id : parseInt(this.id),
          ProductName: result.data.product_Name,
          HSNCODE:result.data.hsN_CODE,
          item_code:result.data.item_Code,
          ProductCategory: result.data.product_Category,
          MRP: result.data.mrp,
          ImageofProduct: result.data.image_of_Product,
          OtherImage:result.data.other_Image,
          ProductBrand: result.data.product_Brand,
          Manufacturer: result.data.manufacturer,
          SalePrice: result.data.sale_Price,
          Description: result.data.additional_Description,
          Unit: result.data.unit,
          TaxIncluded:result.data.tax_Included,
        })
        this.OtherImagesEdit=result.data.other_Image.split(',')
      })
    }
  }

  InitForm() {
    this.ProductForm.patchValue({
      ProductName: '',
      HSNCODE:'',
      item_code:'',
      ProductCategory: '',
      MRP: 0,
      ImageofProduct: '',
      OtherImage:'',
      ProductBrand: '',
      Manufacturer: '',
      SalePrice: 0,
      Description: '',
      Unit: '',
      TaxIncluded:'',
    })
  }

  update() {  
    if (this.editproductform.valid) {
      
      this.upload().then(res => {
        this.uploadOther().then(other_res =>{
        var req = {
          'Id': this.id,
          "Product_Name": this.editproductform.value['ProductName'],
          "HSN_CODE":this.editproductform.value['HSNCODE'],
          "Item_Code":this.editproductform.value['item_code'],
          "Product_Category": this.editproductform.value['ProductCategory'],
          "MRP": this.editproductform.value['MRP'],
          "image_of_Product": res!='' ? res : this.editproductform.value['ImageofProduct'],
          "Other_Image": other_res!='' ? other_res : this.editproductform.value['OtherImage'],
          "product_Brand": this.editproductform.value['ProductBrand'],
          "manufacturer": this.editproductform.value['Manufacturer'],
          "Sale_Price": this.editproductform.value['SalePrice'],
          "additional_Description": this.editproductform.value['Description'],
          "unit": this.editproductform.value['Unit'],
          "Tax_Included":this.editproductform.value['TaxIncluded']
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


  get f() {
    return this.ProductForm.controls;
  }


  Home() {
    this.route.navigate(['/Home'])
  }
  AllProduct() {
    this.route.navigate(['/AllProduct'])
  }
  // AddProduct() {
  //   this.route.navigate(['/AddProduct'])
  // }


  onSubmit() {    
    if (this.ProductForm.valid) {     
      this.upload().then(res => {
        this.uploadOther().then(other_res =>{
          var req = {
            "Product_Name": this.ProductForm.value['ProductName'],
            "HSN_CODE":this.ProductForm.value['HSNCODE'],
            "Item_Code":this.ProductForm.value['item_code'],
            "Product_Category": this.ProductForm.value['ProductCategory'],
            "MRP": this.ProductForm.value['MRP'],
            "image_of_Product": res,
            "other_Image":other_res,
            "product_Brand": this.ProductForm.value['ProductBrand'],
            "manufacturer": this.ProductForm.value['Manufacturer'],
            "Sale_Price": this.ProductForm.value['SalePrice'],
            "additional_Description": this.ProductForm.value['Description'],
            "unit": this.ProductForm.value['Unit'],
            "Tax_Included":this.ProductForm.value['TaxIncluded']
          }
          this.AddProductData.saveusers(req).subscribe((result: any) => {
            alert(result.description);
            if (result.status == "success") {
              this.ProductForm.reset();
              this.InitForm();
              this.OtherImages=[];
              this.url='';
            (document.getElementById("attachments") as HTMLFormElement)['value'] = null;
            (document.getElementById("otherattachments") as HTMLFormElement)['value'] = null;

            }
          })
        })        
      })
    }
  }
  MainUpdateImage=0;
  detectFiles(event: any) {
    this.MainUpdateImage=1;
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
         this.url=event.target.result;      
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

  OtherImages:any=[];
  IsUpdateImage=0;
  detectOtherFiles(event: any) {
    this.IsUpdateImage = 1;
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.OtherImages.push(event.target.result);      
          var mimeType = file.type;
          if (mimeType.match(/image\/*/) != null) {

          }
          else {
            alert('Invalid file has been selected...!!!');
            (document.getElementById("otherattachments") as HTMLFormElement)['value'] = null;
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


  OtherAttachments:any =[];
  async uploadOther() {    
    return new Promise(async resolve => {
      var name: any = document.getElementById('otherattachments');
      if (name.files.length > 0) { 
        for(let index=0; index<name.files.length; index++){
          var res = await this.uploadfile(<File>name.files.item(index));
          if(index==name.files.length-1){
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

  async uploadfile(file:any): Promise<string>{
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

}

