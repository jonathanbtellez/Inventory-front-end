import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

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
      });
    }
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
