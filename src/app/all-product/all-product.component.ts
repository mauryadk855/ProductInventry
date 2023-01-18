import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AddProductService } from '../Services/add-product.service';
//import{DataTablesModule} from 'angular-datatables'


@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {

  ExcelData: any = [];
  data:Array<any>
  totalRecords:string ='';
  page:Number=1;
  Data: any = [];
  baseImageUrl = 'https://localhost:7203';
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
 


  constructor(private route: Router, private ProductList: AddProductService,) {
    this.data=new Array<any>()

  }
  

 
  Home() {
    this.route.navigate(['/Home'])
  }
  AddProduct() {
    this.route.navigate(['/AddProduct'])
  }
  AllProduct() {
    this.route.navigate(['/AllProduct'])
  }
  Submit() {
    this.route.navigate(['/Submit'])
  }
  ProductDetails(){
    this.route.navigate(['/ProductDetails'])
  }


  ngOnInit(): void {    
    this.fetchData();    
  }

  fetchData(){   
    this.dtoptions = {
      pagingType: 'full_numbers'
      
    }; 
    this.ProductList.users().subscribe((result: any) => {
     // console.log(result);
      this.Data = result.data;  
      this.dtTrigger.next(null);    
    });
  }
  




  deleteProduct(id:any){
    this.ProductList.getdeletedata(id).subscribe((result:any)=>{
      console.log(result);
      if(result.status == "success"){
        alert(result.description);
        this.GetDataOnDelete();
      }      
    });
  } 

  

  GetDataOnDelete(){
    this.ProductList.users().subscribe((result: any) => {
      this.Data = result.data;  
    });
  }
 }

   


    