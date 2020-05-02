import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras} from '@angular/router';
import { HttpRequestsService } from '../http-requests.service';
import { HttpParams } from "@angular/common/http";
import { IMTI } from '../mti';

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
  public allResults = [];
  public filteredResultsByMethod = [];
  public filteredResultsByOrganism = [];
  resultsPerPage = [];
  pagesArr = [];

  constructor(private httpRequestsService: HttpRequestsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    var arrayOfParams: Array<string>;
    var params: Params
    const values = this.route.snapshot.queryParamMap.get('values');
    const searchInput = this.route.snapshot.queryParamMap.get('searchInput');
    const path = this.route.snapshot.queryParamMap.get('path');
    // If the value is null, create a new array and store it
    // Else parse the JSON string we sent into an array
    if (values === null) {
        arrayOfParams = new Array<string>();
    } else {
        arrayOfParams = JSON.parse(values);
    }
    switch (searchInput) {
      case 'mirnaName':
        const mirnaName = arrayOfParams[0]
        params = new HttpParams()
        .set('mirnaName', mirnaName)
          break;
      case 'targetName':
        const targetName = arrayOfParams[0]
        params = new HttpParams()
        .set('targetName', targetName)
          break;
      case 'organism':
        const organism = arrayOfParams[0]
        params = new HttpParams()
        .set('organism', organism)
          break;
      case 'mirTar':
        const mir = arrayOfParams[0]
        const tar = arrayOfParams[1]
        params = new HttpParams()
        .set('mirnaName', mir)
        .set('targetName', tar)
          break;
      default:
          break;
  }
    const result = this.httpRequestsService.getWithParams(path , {params})
    result.forEach((value:IMTI)=>this.allResults.push(value)).then(()=> 
    {this.numberOfPages = this.calculateNumberOfPages(this.allResults, this.numberOfMtisPerPage);
    this.createNumberOfPagesArray();
    this.updateIndexMtisView(1,this.allResults);}, ()=> console.log("error"))
  
  }

  createNumberOfPagesArray() {
    this.pagesArr = []
    for (var i = 1; i <= this.numberOfPages; i++) {
      this.pagesArr.push(i);
    }
  }

  getFirstIndexMtiPage (numberOfMtisPerPage, pageNumber) {
    return ((pageNumber * numberOfMtisPerPage) - numberOfMtisPerPage);
  }

  getLastIndexMtiPage (firstIndex, numberOfMtisPerPage) {
    return ((firstIndex + numberOfMtisPerPage) - 1);
  }

  calculateNumberOfPages (results, numberOfMtisPerPage) {
    return Math.ceil(results[0].length / numberOfMtisPerPage);
  }

  updateIndexMtisView (pageNumber,results) {
    this.firstIndexMtiPage = this.getFirstIndexMtiPage(this.numberOfMtisPerPage, pageNumber);
    this.lastIndexMtiPage = this.getLastIndexMtiPage(this.firstIndexMtiPage, this.numberOfMtisPerPage);
    this.addResultsPerPage(results);
  }

  addResultsPerPage (results) {
    this.resultsPerPage = [];
    for (var i = this.firstIndexMtiPage; i <= this.lastIndexMtiPage; i++) {
      if (typeof results[0][i] != "undefined"){
        this.resultsPerPage.push(results[0][i]['mirTar_id']);
      }
    }
  }

  filterByMethod (method) {
    console.log(method)
    this.filteredResultsByMethod = []
    const path = 'getInfoByMethod'
    const params = new HttpParams()
    .set('method', method)
    const result = this.httpRequestsService.getWithParams(path , {params})
    result.forEach((value:IMTI)=>this.filteredResultsByMethod.push(value)).then(()=> 
    {this.numberOfPages = this.calculateNumberOfPages(this.filteredResultsByMethod, this.numberOfMtisPerPage);
    this.createNumberOfPagesArray();
    this.updateIndexMtisView(1,this.filteredResultsByMethod);}, ()=> console.log("error")).then(()=>console.log(this.resultsPerPage))
  }

  filterByOrganism (organism) {
    const path = 'getInfoByOrganism'
    const params = new HttpParams()
    .set('organism', organism)
    const result = this.httpRequestsService.getWithParams(path , {params})
    result.forEach((value:IMTI)=>this.filteredResultsByOrganism.push(value)).then(()=> 
    {this.numberOfPages = this.calculateNumberOfPages(this.filteredResultsByOrganism, this.numberOfMtisPerPage);
    this.createNumberOfPagesArray();
    this.updateIndexMtisView(1,this.filteredResultsByOrganism);}, ()=> console.log("error"))
  }

  getMTIsDetailedResults(mtiId){
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
