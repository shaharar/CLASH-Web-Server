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

//the following component represents results page
export class MtiResultsComponent implements OnInit {

 
  public allResults = []
  public filteredResultsBySeedType = [];


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
  isLoaded = false;


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

  //the following function uses http request to retrieve data according to search fields values and maintain it in compatible data structure
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
      this.isLoaded = true;
    });
  }

  //the following function filters results by seed type and base pairs
  filterResults() {
    this.isFiltered = true;
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
    });
  }

  //the following function performs results download through browser according to requested features 
  downloadResults() {
    var params: Params
    const featureInputs: any = [];
    (this.downloadInputs.map(item => item.value)).forEach(input => {
      input = input.split(' ').join('_');
      input = 'Features_' + input;
      featureInputs.push(input);
    });
    params = new HttpParams()
      .set('featureInputs', featureInputs)
    var path = 'getFeaturesByCategory';
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.downloadRes = results;
      if (this.downloadRes.length > 0) {
        this.downloadService.downloadFile(this.downloadRes, 'MTIs_Results', Object.keys(this.downloadRes[0]));
      }
      else {
        alert("There are no results to download. Please choose other filter inputs.")
      }
    });
  }

  //the following function navigates to visualization component with summarized details about query results and filters
  showSummary() {
    const queryParams: any = {};
    queryParams.numOfResults = this.allResults.length;
    queryParams.seedType = this.seedType;
    queryParams.fromBasePairs = this.fromBasePairs;
    queryParams.toBasePairs = this.toBasePairs;
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/visualization'],navigationExtras);
  }

  //the following function updates checked check lists
  checkUncheckAll() {
    for (var i = 0; i < this.checkListDownload.length; i++) {
      this.checkListDownload[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //the following function checks whether all check boxes of feture categories are checked
  isAllSelected() {
    this.masterSelected = this.checkListDownload.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  //the following function updates download feature categories check boxes values according to checked items
  getCheckedItemList() {
    this.downloadInputs = [];
    for (var i = 0; i < this.checkListDownload.length; i++) {
      if (this.checkListDownload[i].isSelected) {
        this.downloadInputs.push(this.checkListDownload[i]);
      }
    }
  }

  //the following function navigates to detailed-results component with mtiId as parameter
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
