import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {
  public categoryForm: FormGroup;
  public formState: string = "";

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialog: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formState = "Add new";
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    if (this.data != null) {
      this.formState = "Update"
      this.updateForm(data);
    }
  }

  onSave() {
    let data = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value,
    }

    if (this.data != null) {
      // Update category
      this.categoryService.updateCategory(data, this.data.id).subscribe({
        next:((data: any)=> {
          console.log(data);
          this.dialog.close(1);
        }),
        error: (error => {
          console.log(error);
          this.dialog.close(2);
        })
      })

    } else {
      // Create new category
      this.categoryService.saveCategory(data).subscribe({
        next: (data => {
          console.log(data);
          this.dialog.close(1);
        }),
        error: (error => {
          console.log(error);
          this.dialog.close(2);
        })
      })
    }
  }

  onCancel() {
    this.dialog.close(3);
  }

  updateForm(data: any) {
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
    });
  }
}
