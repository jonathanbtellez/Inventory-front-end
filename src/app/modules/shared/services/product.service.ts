import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUri : string = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) { }

  getProduct(){
    const endpoint = `${this.baseUri}/products`;
    return this.http.get(endpoint);
  }
}
