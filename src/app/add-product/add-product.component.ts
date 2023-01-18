import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductService } from '../Services/add-product.service';
import { ActivatedRoute } from '@angular/router';
import { BulkLoadProduct } from './bulk-product-entity';
import * as XLSX from 'xlsx';


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
  ExcelData: any = [];
  source: any = [];
  products: any = [];
  tempdata: any = [];
  storeData: any = [];
  worksheet:any = [];
  Temp: any = [];
  fileUploaded : any;
  formModel:any;
  

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
  BulkProduct() {
    this.route.navigate(['/BulkProduct'])
  }


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

  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  ResetPopup(){
    this.myInput.nativeElement.value="";
  }

  LocalDataSource: any = [];
  @ViewChild('myInput', { static: false }) myInput!: ElementRef;


  successcount = 0;
  failedcount = 0;
  showlog: boolean = true;

  uploadlist = async () => {
    var request = JSON.stringify(this.products);
    var req = {
      data: request
    }
    this.AddProductData.bulksaveusers(req).subscribe((result: any) => {
      if(result.status == 'success') {
        alert(result.description);
        this.displayStyle = "none";
        this.myInput.nativeElement.value="";
        this.Temp.reset();
        this.showlog = false;
        this.products = [];

      }
    })
  }

 
  validateInput = async () => {
    let result = await this.asyncfill();

    if (result) {
      this.source = this.products;
    }
  }
  asyncfill = async () => {
    return new Promise(async (resolve, reject) => {
      var flag = false;
      for (var i = 0; i < this.Temp.length; i++) {
        if (flag == false) {
          await this.FillEmp(this.Temp[i], i).then((res: any) => {
            if (i == this.Temp.length - 1) {
              resolve(true);
            }
          }, err => {
            flag = true;
            reject();
          })
        }
      }
    })
  }
  FillEmp(i: any, index: any) {
    return new Promise((resolve, reject) => {
      if (
        i["Product Name"] == undefined || i["Product Name"] == '' ||
        i["Category"] == undefined || i["Category"] == '' ||
        i["Is Tax Included"] == undefined || i["Is Tax Included"] == '' ||
        i["Sale Price"] == undefined || i["Sale Price"] == '' ||
        i["MRP"] == undefined || i["MRP"] == '') {
        console.warn('danger', 'You have not filled mandatory field of row number : ' + (index + 2), 'error')
        reject();
       
      }
      else {
        var exp = new BulkLoadProduct();
        exp["Id"] = '0';
        exp["Product_Name"] = i["Product Name"];
        exp["HSN_CODE"] = i["HSN CODE"];
        exp["Item_Code"] = i["It  em Code"];
        exp["Product_Category"] = i["Category"];
        exp["MRP"] = i["MRP"];
        exp["Image_of_Product"] = i["Product Main Image"];
        exp["Other_Image"] = i["Additional Images"];
        exp["Product_Brand"] = i["Brand"];
        exp["Manufacturer"] = i["Manufacturer"];
        exp["Sale_Price"] = i["Sale Price"];
        exp["Additional_Description"] = i["Description"];
        exp["Unit"] = i["Unit"];
        exp["Tax_Included"] = i["Is Tax Included"];
        this.products.push(exp);
        this.tempdata.push(exp);
        resolve(1);
      }
    })
  }


  uploadedFile(event:any) {
    this.showlog = true;
    this.fileUploaded = event.target.files[0];
    this.readExcel(event);
    this.products = [];
  }



  readExcel(event:any) {
    let readFile = new FileReader();
    this.fileUploaded = event.target.files[0];
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      this.Temp = XLSX.utils.sheet_to_json(this.worksheet, { raw: true });
      if (this.Temp.length > 0) {
        this.validateInput()
      }
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }


}

