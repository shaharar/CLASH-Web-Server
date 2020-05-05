import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from "@angular/common/http";
import { FreeEnergyFeatures, IMTI, HotEncodingMirnaFeatures, HotEncodingMrnaFeatures, SeedFeatures, SiteAccessibility, MrnaCompositionFeatures, MirnaPairingFeatures } from '../mti';


@Component({
  selector: 'app-detailed-results',
  templateUrl: './detailed-results.component.html',
  styleUrls: ['./detailed-results.component.css']
})
export class DetailedResultsComponent implements OnInit {

  public mirTarId;
  public generalInfo = []
  public freeEnergyFeatures = []
  public hotEncodingMirnaFeatures = []
  public hotEncodingMrnaFeatures = []
  public mirnaPairingFeatures = []
  public mrnaCompositionFeatures = []
  public seedFeatures = []
  public siteAccessibility = []
  public isDataAvailable = false;

  constructor(private httpRequestsService: HttpRequestsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mirTarId = this.route.snapshot.queryParamMap.get('mirTarId');
    this.getMTIsInfo('generalInfo')
      .forEach((value: IMTI) => this.generalInfo.push(value))
      .then(() => this.getMTIsInfo('freeEnergyInfo').
        forEach((value: FreeEnergyFeatures) => this.freeEnergyFeatures.push(value)))
      .then(() => this.getMTIsInfo('hotEncodingMirnaInfo').
        forEach((value: HotEncodingMirnaFeatures) => this.hotEncodingMirnaFeatures.push(value)))
      .then(() => this.getMTIsInfo('hotEncodingMrnaInfo').
        forEach((value: HotEncodingMrnaFeatures) => this.hotEncodingMrnaFeatures.push(value)))
      .then(() => this.getMTIsInfo('mirnaPairingInfo').
        forEach((value: MirnaPairingFeatures) => this.mirnaPairingFeatures.push(value)))
      .then(() => this.getMTIsInfo('mrnaCompositionInfo').
        forEach((value: MrnaCompositionFeatures) => this.mrnaCompositionFeatures.push(value)))
      .then(() => this.getMTIsInfo('seedInfo').
        forEach((value: SeedFeatures) => this.seedFeatures.push(value)))
      .then(() => this.getMTIsInfo('siteAccessibilityInfo').
        forEach((value: SiteAccessibility) => this.siteAccessibility.push(value)))
      .then(() => this.isDataAvailable = true);

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
        break;
      case 'freeEnergyInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Free_Energy')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'hotEncodingMirnaInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Hot_Encoding_miRNA')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'hotEncodingMrnaInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Hot_Encoding_mRNA')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'mirnaPairingInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_miRNA_Pairing')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'mrnaCompositionInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_mRNA_Composition')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'seedInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Seed_Features')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      case 'siteAccessibilityInfo':
        params = new HttpParams()
          .set('mirTarId', this.mirTarId)
          .set('featureCategory', 'Features_Site_Accessibility')
        path = 'getFeatures'
        result = this.httpRequestsService.getWithParams(path, { params })
        break;
      default:
        break;

    }
    return result

  }

}
