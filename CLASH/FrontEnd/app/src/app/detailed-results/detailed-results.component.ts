import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from "@angular/common/http";
import { FreeEnergyFeatures, IMTI } from '../mti';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detailed-results',
  templateUrl: './detailed-results.component.html',
  styleUrls: ['./detailed-results.component.css']
})
export class DetailedResultsComponent implements OnInit {

  public mirTarId;
  public generalInfo = []
  public freeEnergyFeatures = []

  constructor(private httpRequestsService: HttpRequestsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mirTarId = this.route.snapshot.queryParamMap.get('mirTarId');
    this.getMTIsInfo('generalInfo')
    this.getMTIsInfo('freeEnergyInfo')
    console.log(this.generalInfo)
    console.log(this.freeEnergyFeatures)

  }

  getMTIsInfo(info) {

    var params: Params
    var path: string
    var result;

    switch (info) {
      case 'generalInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
        path = 'getInfoByMirTarId'
        result = this.httpRequestsService.getWithParams(path, { params })
        result.forEach((value: IMTI) => this.generalInfo.push(value))
        break;
      case 'freeEnergyInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Free_Energy')
        path = 'getFeaturesByCategory'
        result = this.httpRequestsService.getWithParams(path, { params })
        result.forEach((value: FreeEnergyFeatures) => this.freeEnergyFeatures.push(value))
        break;
      default:
        break;


    }

  }


}
