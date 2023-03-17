import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../shared/services/product.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
    ){};

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

  openProductDialog(){
    const dialogRef = this.dialog.open( NewProductComponent,{
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        this.openSnackBar("Product saved","Success");
        this.getProducts();
      }else if(result == 2){
        this.openSnackBar("Something went wrong to save product","Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
    return this. snackBar.open(message,action, {
      duration: 3000
    })
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
