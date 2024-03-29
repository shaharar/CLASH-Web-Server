import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
//the following component handles data statistics and visualization
export class VisualizationComponent implements OnInit {

  constructor(private httpRequestsService: HttpRequestsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer) { }
  statistics;
  encoded_pca;
  encoded_seed;
  numOfResults;
  seedType;
  fromBasePairs;
  toBasePairs;
  isSeedType = false;
  isBasePairs = false;
  isLoaded = false;

  ngOnInit(): void {
    //get filter values from request
    this.numOfResults = this.route.snapshot.queryParamMap.get('numOfResults');
    this.seedType = this.route.snapshot.queryParamMap.get('seedType');
    this.fromBasePairs = this.route.snapshot.queryParamMap.get('fromBasePairs');
    this.toBasePairs = this.route.snapshot.queryParamMap.get('toBasePairs');
    if (this.seedType != 'None' && this.seedType != '') {
      this.isSeedType = true;
    }
    if (this.fromBasePairs != '' && this.toBasePairs != '') {
      this.isBasePairs = true;
    }
    var path = 'getDataVisualization'
    //http request to get statistics computations and data visualized representation
    this.httpRequestsService.get(path).subscribe((results) => {
      this.encoded_pca = results[0]
      this.encoded_seed = results[1]
      this.getStatistics();
      this.isLoaded = true;
    });
  }

  //get pca graph
  getPcaImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.encoded_pca);
  }

  //get seed type graph 
  getSeedImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.encoded_seed);
  }

  //maintain statistics in compatible data structure
  getStatistics() {
    var path = 'getStatistics'
    this.httpRequestsService.get(path).subscribe((results) => {
      this.statistics = results;
    });
  }
}
