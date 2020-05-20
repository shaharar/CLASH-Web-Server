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

  ngOnInit(): void {
    var isFiltered = this.route.snapshot.queryParamMap.get('isFiltered');
    var path = 'getDataVisualization'
    var params: Params
    params = new HttpParams()
      .set('isFiltered', isFiltered.toString())
    console.log(params.get('isFiltered'))
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      console.log('HTTP request')
    });
  }

}
