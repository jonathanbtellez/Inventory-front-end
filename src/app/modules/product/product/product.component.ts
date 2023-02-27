import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  constructor(private productService: ProductService){};

  ngOnInit(): void{
    this.getProducts();
  }

  displayedColumns: string[] = ["id","name","price","quantity","category","picture", "actions"];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts(){
    this.productService.getProduct().subscribe({
      next: ( (data:any) => {
        console.log("Products response: ", data);
        this.processProductResponse(data);
      }),
      error:( (error:any) =>{
        console.log("Fail: ", error);
      })
    })
  }

  processProductResponse(resp:any){
    const dateProduct: ProductElement[] = [];
    if(resp.metadata[0].code == "00"){
      let listProduct = resp.product.products;
      listProduct.forEach( ( element:ProductElement )=> {
        element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,'+element.picture;
        dateProduct.push(element);
      });

      // Setting datasources
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  picture: any;

}
