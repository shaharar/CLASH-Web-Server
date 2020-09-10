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

// The following service handles http requests 
export class HttpRequestsService {

  // API general URI 
  private url: string = "http://icc.ise.bgu.ac.il/MirTarFeaturesDB/backend";

  private fullPath: string;

  constructor(private http: HttpClient) { }

  // handles http get request with parameters
  getWithParams(path: string, parameters: Params):any{
    console.log(path)
    this.fullPath = this.url + path;
    return this.http.get(this.fullPath, parameters).pipe(
      catchError(this.errorHandler));
  }

  // handles http get request without parmeters
  get(path: string):any{
    this.fullPath = this.url + path;
    return this.http.get(this.fullPath).pipe(
      catchError(this.errorHandler));
  }

  // handles http request errors
  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || "Server Error");
  }
}