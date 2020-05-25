import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  constructor(private httpRequestsService: HttpRequestsService,
    private route: ActivatedRoute,
    private router: Router) { }
    statistics;

  ngOnInit(): void {
    var path = 'getDataVisualization'
    this.httpRequestsService.get(path).subscribe((results) => {
      console.log("HTTP Request")
      this.getStatistics();
    });     
  }

  getStatistics() {
    var path = 'getStatistics'
    this.httpRequestsService.get(path).subscribe((results) => {
      console.log(results)
      this.statistics = results;
      console.log(this.statistics)
    });
  }
}
