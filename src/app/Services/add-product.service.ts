import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {

  PostDataUrl='https://localhost:7203/api/AddProduct/AddProduct'
  BulkPostDataUrl='https://localhost:7203/api/AddProduct/AddProductBulk'
  
  GetDataUrl='https://localhost:7203/api/AddProduct/GetAllProduct'

  PostImgUrl='https://localhost:7203/api/AddProduct/UploadAttachments'

  PostOtherImgUrl='https://localhost:7203/api/AddProduct/UploadMultipleImages'

  GetDataCategory='https://localhost:7203/api/AddProduct/GetAllCategory'

  deleteproduct='https://localhost:7203/api/AddProduct/DeleteProduct'

  getproductdata='https://localhost:7203/api/AddProduct/GetProductById'


  constructor(private http:HttpClient) { }

  users(){
    return this.http.get(this.GetDataUrl)
  }
  saveusers(data:any){
    debugger;    
    return this.http.post(this.PostDataUrl,data)
  }

  bulksaveusers(data:any){
    debugger;    
    return this.http.post(this.BulkPostDataUrl,data)
  }

  imgusers(data:any){
    return this.http.post(this.PostImgUrl,data)
  }

  uploadProductImages(data:any){
    return this.http.post(this.PostOtherImgUrl,data)
  }
  categorydata(){
    return this.http.get(this.GetDataCategory)
  }
  getdeletedata(id:any){
    debugger;
    return this.http.delete(this.deleteproduct+'?id='+id)
  }
  getproductByID(id:any){
    return this.http.get(this.getproductdata+'?id='+id);
  }
}
