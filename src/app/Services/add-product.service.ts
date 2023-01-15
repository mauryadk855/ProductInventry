import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {

  PostDataUrl='https://localhost:7203/api/AddProduct/AddProduct'
  
  GetDataUrl='https://localhost:7203/api/AddProduct/GetAllProduct'

  PostImgUrl='https://localhost:7203/api/AddProduct/UploadAttachments'

  GetDataCategory='https://localhost:7203/api/AddProduct/GetAllCategory'

  constructor(private http:HttpClient) { }

  users(){
    return this.http.get(this.GetDataUrl)
  }
  saveusers(data:any){
    
    return this.http.post(this.PostDataUrl,data)
  }
  imgusers(data:any){
    return this.http.post(this.PostImgUrl,data)
  }
    categorydata(){
    return this.http.get(this.GetDataCategory)
  }
}
