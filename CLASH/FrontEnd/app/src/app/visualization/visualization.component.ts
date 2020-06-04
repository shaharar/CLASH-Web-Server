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
  isSeedType = true;
  isBasePairs = true;

  ngOnInit(): void {
    this.numOfResults = this.route.snapshot.queryParamMap.get('numOfResults');
    this.seedType = this.route.snapshot.queryParamMap.get('seedType');
    this.fromBasePairs = this.route.snapshot.queryParamMap.get('fromBasePairs');
    this.toBasePairs = this.route.snapshot.queryParamMap.get('toBasePairs');
    if (this.seedType == 'None') {
      this.isSeedType = false;
    }
    if (this.fromBasePairs == '' || this.toBasePairs == '') {
      this.isBasePairs = false;
    }
    var path = 'getDataVisualization'
    this.httpRequestsService.get(path).subscribe((results) => {
      this.encoded_pca = results[0]
      this.encoded_seed = results[1]
      this.getStatistics();
    });
  }

  getPcaImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.encoded_pca);
  }

  getSeedImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.encoded_seed);
  }

  getStatistics() {
    var path = 'getStatistics'
    this.httpRequestsService.get(path).subscribe((results) => {
      this.statistics = results;
    });
  }
}
