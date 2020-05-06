import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from "@angular/common/http";
import { DownloadService } from '../download.service'



@Component({
  selector: 'app-mti-results',
  templateUrl: './mti-results.component.html',
  styleUrls: ['./mti-results.component.css']
})
export class MtiResultsComponent implements OnInit {

  numberOfMtisPerPage = 20;
  numberOfPages;
  firstIndexMtiPage = 0;
  lastIndexMtiPage = 0;
  public allResults = []
  public filteredResultsBySeedType = [];
  public results = [];
  resultsPerPage = [];
  pagesArr = [];

  params: Params;
  downloadInputs: any;
  masterSelected = false;
  checkListDownload = [];
  downloadRes = [];


  constructor(private httpRequestsService: HttpRequestsService,
    private downloadService: DownloadService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getResults('search');
    this.checkListDownload = [
      { value: 'Free Energy', isSelected: false },
      { value: 'Seed Features', isSelected: false },
      { value: 'miRNA Pairing', isSelected: false },
      { value: 'mRNA Composition', isSelected: false },
      { value: 'Site Accessibility', isSelected: false },
      { value: 'Hot Encoding miRNA', isSelected: false },
      { value: 'Hot Encoding mRNA', isSelected: false }
    ];
    this.getCheckedItemList();
  }

  getResults(type) {
    var params: Params
    const mirnaName = this.route.snapshot.queryParamMap.get('mirnaName');
    const mirnaSeq = this.route.snapshot.queryParamMap.get('mirnaSeq');
    const targetName = this.route.snapshot.queryParamMap.get('targetName');
    const dataset = this.route.snapshot.queryParamMap.get('dataset');
    const DBVersion = this.route.snapshot.queryParamMap.get('DBVersion');
    const organismInputs = JSON.parse(this.route.snapshot.queryParamMap.get('organismInputs'));
    const methodInputs = JSON.parse(this.route.snapshot.queryParamMap.get('methodInputs'));
    const mrnaRegionInputs = JSON.parse(this.route.snapshot.queryParamMap.get('mrnaRegionInputs'));
    const protocolInputs = JSON.parse(this.route.snapshot.queryParamMap.get('protocolInputs'));

    params = new HttpParams()
      .set('mirnaName', mirnaName)
      .set('mirnaSeq', mirnaSeq)
      .set('targetName', targetName)
      .set('dataset', dataset)
      .set('DBVersion', DBVersion)
      .set('organismInputs', organismInputs)
      .set('methodInputs', methodInputs)
      .set('mrnaRegionInputs', mrnaRegionInputs)
      .set('protocolInputs', protocolInputs)

    var path;
    switch (type) {
      case 'search':
        path = 'getMTIs';
        this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
          this.allResults = results
          console.log(this.allResults)
        });
        break;
      case 'filter':
        path = 'getMTIs';
        this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
          this.allResults = results
          console.log(this.allResults)
        });
        break;
      case 'download':
        params.set('featureInputs', this.downloadInputs.map(item => item.value))
      //  JSON.stringify([this.checkEmptyInputsArr
        path = 'getFeaturesByCategory';
        this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
          this.downloadRes = results
          console.log(this.downloadRes)
        });
        break;
    }
  }

  createNumberOfPagesArray() {
    this.pagesArr = []
    for (var i = 1; i <= this.numberOfPages; i++) {
      this.pagesArr.push(i);
    }
  }

  getFirstIndexMtiPage(numberOfMtisPerPage, pageNumber) {
    return ((pageNumber * numberOfMtisPerPage) - numberOfMtisPerPage);
  }

  getLastIndexMtiPage(firstIndex, numberOfMtisPerPage) {
    return ((firstIndex + numberOfMtisPerPage) - 1);
  }

  calculateNumberOfPages() {
    return Math.ceil(this.results.length / this.numberOfMtisPerPage);
  }

  updateIndexMtisView(pageNumber) {
    this.firstIndexMtiPage = this.getFirstIndexMtiPage(this.numberOfMtisPerPage, pageNumber);
    this.lastIndexMtiPage = this.getLastIndexMtiPage(this.firstIndexMtiPage, this.numberOfMtisPerPage);
    this.addResultsPerPage();
  }

  addResultsPerPage() {
    this.resultsPerPage = [];
    for (var i = this.firstIndexMtiPage; i <= this.lastIndexMtiPage; i++) {
      if (typeof this.results[i] != "undefined") {
        this.resultsPerPage.push(this.results[i]['mirTar_id']);
      }
    }
  }


  downloadResults() {
      this.getResults('download');
      this.downloadService.downloadFile(this.downloadRes, 'MTIs_Results', Object.keys(this.downloadRes[0]));
  }

  showSummary() {

  }


  checkUncheckAll() {
    for (var i = 0; i < this.checkListDownload.length; i++) {
      this.checkListDownload[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checkListDownload.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.downloadInputs = [];
    for (var i = 0; i < this.checkListDownload.length; i++) {
      if (this.checkListDownload[i].isSelected) {
        this.downloadInputs.push(this.checkListDownload[i]);
      }
    }
  }

  filterBySeedType(seedType) {
    // this.filteredResultsByMethod = []
    if (seedType == 'None') {
      this.results = this.allResults
      console.log(this.results.length)
      this.filteredResultsBySeedType = this.results
      this.numberOfPages = this.calculateNumberOfPages()
      this.createNumberOfPagesArray()
      this.updateIndexMtisView(1)
    }
    else {
      //  const path = 'getInfoByMethod'
      const params = new HttpParams()
        .set('seedType', seedType)

      // this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      // this.results = []
      // for (var i = 0; i < results.length; i++) {
      // for (var j = 0; j < this.allResults.length; j++) {
      // if (results[i]['mirTar_id'] == this.allResults[j]['mirTar_id']) {
      // this.results.push(results[i])
      // }
      //this.results.push(results[i]['mirTar_id'])
      //   }

      //   }
      //console.log(this.results.length)
      //this.filteredResultsByMethod = this.results
      //this.numberOfPages = this.calculateNumberOfPages()
      //this.createNumberOfPagesArray()
      //this.updateIndexMtisView(1)
      // })
    }
    //const result = this.httpRequestsService.getWithParams(path, { params })
    //result.forEach((value: IMTI) => this.filteredResultsByMethod.push(value)).then(() => {
    //console.log(this.filteredResultsByMethod[0].filter(x => !this.allResults.includes(x.mirTarId)))


    //      this.numberOfPages = this.calculateNumberOfPages(this.filteredResultsByMethod, this.numberOfMtisPerPage);
    //    this.createNumberOfPagesArray();
    //  this.updateIndexMtisView(1, this.filteredResultsByMethod);
    //}, () => console.log("error"))
  }

  getMTIsDetailedResults(mtiId) {
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.mirTarId = mtiId
    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/detailed-results'], navigationExtras);
  }
}
