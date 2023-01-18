import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AddProductService } from '../Services/add-product.service';
import { BulkLoadProduct } from './bulk-product-entity'

@Component({
  selector: 'app-bulk-product',
  templateUrl: './bulk-product.component.html',
  styleUrls: ['./bulk-product.component.scss']
})
export class BulkProductComponent {

  constructor(private route: Router, private AddProductData: AddProductService,) { }

  ExcelData: any = [];
  source: any = [];
  products: any = [];
  tempdata: any = [];
  storeData: any = [];
  worksheet:any = [];
  Temp: any = [];
  fileUploaded : any;

  LocalDataSource: any = [];
  @ViewChild('myInput', { static: false }) myInput!: ElementRef;


  successcount = 0;
  failedcount = 0;
  showlog: boolean = true;

  upload = async () => {
    var request = JSON.stringify(this.products);
    var req = {
      data: request
    }
    this.AddProductData.bulksaveusers(req).subscribe((result: any) => {
      if(result.status == 'success') {
        alert(result.description);
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
      console.log(this.Temp)
      if (this.Temp.length > 0) {
        this.validateInput()
      }
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

}
