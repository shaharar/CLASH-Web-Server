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

  // numberOfMtisPerPage = 20;
  // numberOfPages;
  // firstIndexMtiPage = 0;
  // lastIndexMtiPage = 0;
  public allResults = []
  public filteredResultsBySeedType = [];
  // public results = [];
  // resultsPerPage = [];
  // pagesArr = [];

  params: Params;
  downloadInputs: any;
  masterSelected = false;
  checkListDownload = [];
  downloadRes = [];
  searchTime: number;
  seedType: string = "";
  searchResults: any[];
  basePairs: string = "";
  fromBasePairs = "";
  toBasePairs = "";  
  isFiltered = false;


  constructor(private httpRequestsService: HttpRequestsService,
    private downloadService: DownloadService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getSearchResults();
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

  getSearchResults() {
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

    var path = 'getMTIs';
    var currentTime = Date.now()
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.allResults = results
      this.searchResults = results;
      this.searchTime = (Date.now()-currentTime)/1000
    });
  }

  filterResults() {
    if (this.searchResults.length == 0) {
      return
    }
    if (this.seedType == "") {
        this.seedType = 'None';
    }
    var params: Params
    params = new HttpParams()
      .set('seedType', this.seedType)
      .set('fromBasePairs', this.fromBasePairs)
      .set('toBasePairs', this.toBasePairs)
    var path = 'getMTIsByFilterInputs';
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.allResults = results;
      // console.log(this.allResults);
      // console.log(this.searchResults);
    });

    // if (this.seedType == 'None' && this.fromBasePairs == '' && this.toBasePairs == '') {
    //   console.log("enter if")
    //   this.allResults = this.searchResults;
    //   console.log(this.allResults);
    //   console.log(this.searchResults);
    // }
    // else {
    //   console.log("enter else")     
    //   this.getResults('filter').subscribe((results) => {
    //     this.allResults = results;
    //     console.log(this.allResults);
    //     console.log(this.searchResults);
    //     });
    // }
    // this.isFiltered = true;
  }

  downloadResults() {
    var params: Params
    const featureInputs: any = [];
    (this.downloadInputs.map(item => item.value)).forEach(input => {
      input = input.split(' ').join('_');
      input = 'Features_' + input;
      featureInputs.push(input);
    });
    // console.log(featureInputs)
    params = new HttpParams()
      .set('featureInputs', featureInputs)
    var path = 'getFeaturesByCategory';
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      // console.log(results) 
      // console.log(this.allResults)
      this.downloadRes = results;
      if (this.downloadRes.length > 0) {
        this.downloadService.downloadFile(this.downloadRes, 'MTIs_Results', Object.keys(this.downloadRes[0]));
            // console.log(this.downloadRes)
      }
      else {
        alert("There are no results to download. Please choose other filter inputs.")
      }
    });
  }

  showSummary() {
    // const queryParams: any = {};
    // queryParams.isFiltered = this.isFiltered;
    // const navigationExtras: NavigationExtras = {
    //   queryParams
    // };
    // this.router.navigate(['/visualization'],navigationExtras);
    this.router.navigate(['/visualization']);
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



  // ************************* Pagination ************************* //
    // createNumberOfPagesArray() {
  //   this.pagesArr = []
  //   for (var i = 1; i <= this.numberOfPages; i++) {
  //     this.pagesArr.push(i);
  //   }
  // }

  // getFirstIndexMtiPage(numberOfMtisPerPage, pageNumber) {
  //   return ((pageNumber * numberOfMtisPerPage) - numberOfMtisPerPage);
  // }

  // getLastIndexMtiPage(firstIndex, numberOfMtisPerPage) {
  //   return ((firstIndex + numberOfMtisPerPage) - 1);
  // }

  // calculateNumberOfPages() {
  //   return Math.ceil(this.results.length / this.numberOfMtisPerPage);
  // }

  // updateIndexMtisView(pageNumber) {
  //   this.firstIndexMtiPage = this.getFirstIndexMtiPage(this.numberOfMtisPerPage, pageNumber);
  //   this.lastIndexMtiPage = this.getLastIndexMtiPage(this.firstIndexMtiPage, this.numberOfMtisPerPage);
  //   this.addResultsPerPage();
  // }

  // addResultsPerPage() {
  //   this.resultsPerPage = [];
  //   for (var i = this.firstIndexMtiPage; i <= this.lastIndexMtiPage; i++) {
  //     if (typeof this.results[i] != "undefined") {
  //       this.resultsPerPage.push(this.results[i]['mirTar_id']);
  //     }
  //   }
  // }


}
