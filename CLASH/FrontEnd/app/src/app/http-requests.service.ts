import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IMTI } from './mti';
import { HttpParams } from "@angular/common/http";
import { Params } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

// private url: string = "http://localhost:8155/";
 private url: string = "http://icc.ise.bgu.ac.il/MirTarFeaturesDB/backend";
  // private url: string = "";

  private fullPath: string;

  constructor(private http: HttpClient) { }

  // get(path: string): Observable<IMTI[]> {
  //  this.fullPath = this.url + path;
  //  return this.http.get<IMTI[]>(this.fullPath).pipe(
  //    catchError(this.errorHandler)); 
  //  }

  getWithParams(path: string, parameters: Params):any{
    console.log(path)
    this.fullPath = this.url + path;
    return this.http.get(this.fullPath, parameters).pipe(
      catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || "Server Error");
  }
}