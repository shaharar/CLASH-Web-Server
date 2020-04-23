
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IMTI } from './mti';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  private url: string = "http://localhost:5000/";
  private fullPath: string;

  constructor(private http: HttpClient) { }

  get(path: string): Observable<IMTI[]> {
    this.fullPath = this.url + path;
    return this.http.get<IMTI[]>(this.fullPath).pipe(
      catchError(this.errorHandler)); 
  }

   getPositiveInfo(): Observable<IMTI[]> {
  //   return this.http.get<IMTI[]>(this.url).pipe(
  //           catchError(this.errorHandler)); 
    return;     
   }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || "Server Error");
  }
}
