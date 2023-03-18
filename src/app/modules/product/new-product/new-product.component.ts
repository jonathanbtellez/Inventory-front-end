import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';

export interface Category {
  id: Number,
  name: string,
  description: string,
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})

export class NewProductComponent {
  public productForm: FormGroup;
  public formState: string = "";
  categories: Category[] = [];
  selectedFile: any;
  nameImg: string = "";


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialog: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formState = "Add new";
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required],
    });

    if (this.data != null) {
      this.formState = "Update"
      this.updateForm(data);
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onSave() {
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryId', data.category);

    if (this.data != null) {
      // Update product
      this.productService.updateProduct(this.data.id, uploadImageData)
        .subscribe({
          next: ((data: any) => this.dialog.close(1)),
          error: ((error: any) => this.dialog.close(2))
        })
    } else {
      // Calling the service to save the product
      this.productService.saveProduct(uploadImageData)
        .subscribe({
          next: ((data: any) => this.dialog.close(1)),
          error: ((error: any) => this.dialog.close(2))
        })
    }
  }

  onCancel() {
    this.dialog.close(3);
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe({
        next: ((data: any) => {
          console.log(data);
          this.categories = data.categoryResponse.category;
        }),
        error: ((error: any) => {
          console.log("Error to get categories", error);
        })
      });
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.nameImg = this.selectedFile.name;
  }

  updateForm(data: any) {
    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      quantity: [data.quantity, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ['', Validators.required],
    });
  }
}
