import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  baseUri : string = "http://localhost:8080/api/v1"

  /**
   * Get all categories
   * @returns categories
   */
  getCategories(){
    const endPoint=`${this.baseUri}/categories`;
    return this.http.get(endPoint);
  }
}
