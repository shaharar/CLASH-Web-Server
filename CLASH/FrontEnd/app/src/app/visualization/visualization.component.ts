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

  ngOnInit(): void {
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
