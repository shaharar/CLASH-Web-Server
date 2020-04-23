import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from "@angular/common/http";



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public MTIs = [];
  public errorMsg;

  constructor(private httpRequestsService: HttpRequestsService) { }

  ngOnInit(): void {
  }

  getMTIByMirnaName(mirnaName): void {
    const params = new HttpParams()
    .set('mirnaName', mirnaName)
    this.httpRequestsService.getWithParams("getInfoByMir" , {params})
    .subscribe(data => this.MTIs = data,
              error => this.errorMsg = error);
  }

  getMTIByTargetName(targetName): void {
    const params = new HttpParams()
    .set('targetName', targetName)
    this.httpRequestsService.getWithParams("getInfoByTarget" , {params})
    .subscribe(data => this.MTIs = data,
              error => this.errorMsg = error);
  }

  getMTIByOrganism(organism): void {
    const params = new HttpParams()
    .set('organism', organism)
    this.httpRequestsService.getWithParams("getInfoByOrganism" , {params})
    .subscribe(data => this.MTIs = data,
              error => this.errorMsg = error);
  }

  getMTIByMirTar(mirnaName,targetName): void {
    const params = new HttpParams()
    .set('mirnaName', mirnaName)
    .set('targetName', targetName)
    this.httpRequestsService.getWithParams("getDuplexByMirTar" , {params})
    .subscribe(data => this.MTIs = data,
              error => this.errorMsg = error);
  }

}
