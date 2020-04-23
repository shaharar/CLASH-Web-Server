import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';

@Component({
  selector: 'app-mti-details',
 // templateUrl: './mti-details.component.html',
 template: `<h2> MTIs: </h2>
            <h3> {{errorMsg}} </h3>
            <ul *ngFor="let mti of MTIs">
              <li>{{mti.miRNA_name}}</li>
            </ul>
            `,
  styleUrls: ['./mti-details.component.css']
})
export class MtiDetailsComponent implements OnInit {

  public MTIs = [];
  public errorMsg;
  constructor(private httpRequestsService: HttpRequestsService) { }

  ngOnInit(): void {
    //this.httpRequestsService.get("/")
    //.subscribe(data => this.MTIs = data,
         //     error => this.errorMsg = error);
  }

}
