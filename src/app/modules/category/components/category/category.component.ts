import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  constructor(
    private categoryServices: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit():void {
    this.getCategories();
  }

  displayedColumns: string[] = ["id","name","description","actions"];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories() {
    this.categoryServices.getCategories().subscribe({
      next: (data) => {
        this.processCategoriesResponse(data)
      }, error: (error) => {
        console.log(error)
      }
    })
  }

  processCategoriesResponse (resp: any){
    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00"){
      let listCategories = resp.categoryResponse.category
      listCategories.forEach((element: CategoryElement) => {
        dataCategory.push(element);
        this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  edit(id: number, name: string, description: string){
    const dialogRef = this.dialog.open( NewCategoryComponent,{
      width: "50%",
      data: {id: id, name: name, description: description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        this.openSnackBar("Category edited","Success");
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar("Something went wrong to edit category","Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open( ConfirmComponent,{
      width: "30%",
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        this.openSnackBar("Category deleted","Success");
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar("Something went wrong to delete category","Error");
      }
    });
  }

  search(value: string){
    if(value.length === 0){
      return this.getCategories();
    }

    this.categoryServices.findCategoryById(value).subscribe({
      next: ((data: any) =>{
        this.processCategoriesResponse(data);
      })
    })
  }

  openCategoryDialog(){
    const dialogRef = this.dialog.open( NewCategoryComponent,{
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        this.openSnackBar("Category saved","Success");
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar("Something went wrong to save category","Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
    return this. snackBar.open(message,action, {
      duration: 3000
    })
  }
}

export interface CategoryElement {
  id: Number,
  name: string,
  description: string,
}
