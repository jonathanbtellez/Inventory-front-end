import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  constructor(private categoryServices: CategoryService) {

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
}

export interface CategoryElement {
  id: Number,
  name: string,
  description: string,

}
