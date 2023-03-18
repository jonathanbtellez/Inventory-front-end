import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUri : string = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) { }

  /**
   * Get all products
   * @returns
   */
  getProduct(){
    const endpoint = `${this.baseUri}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Save product
   * @param body
   * @returns
   */
  saveProduct(body:any){
    const endpoint = `${this.baseUri}/products`;
    return this.http.post(endpoint,body);
  }

  /**
   * Update product
   * @param id
   * @param body
   * @returns
   */
  updateProduct(id: number, body:any){
    const endpoint = `${this.baseUri}/products/${id}`;
    return this.http.put(endpoint,body);
  }

  /**
   * Delete product
   * @param id
   * @returns
   */
  deleteProduct(id: number){
    const endpoint = `${this.baseUri}/products/${id}`;
    return this.http.delete(endpoint);
  }

}
