import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
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
  public allResults = []
  public filteredResultsByMethod = [];
  public filteredResultsByOrganism = [];
  public results = [];
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
    //const result = this.httpRequestsService.getWithParams(path , {params})
    //result.forEach((value:IMTI)=>this.allResults.push(value)).then(()=> 
    //{this.numberOfPages = this.calculateNumberOfPages(this.allResults, this.numberOfMtisPerPage);
    //this.createNumberOfPagesArray();
    //this.updateIndexMtisView(1,this.allResults);}, ()=> console.log("error"))

    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.results = []
      this.allResults = results
      this.results = results
      this.numberOfPages = this.calculateNumberOfPages()
      this.createNumberOfPagesArray()
      this.updateIndexMtisView(1)
    })

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

  filterByMethod(method) {
    console.log(method)
    // this.filteredResultsByMethod = []
    if (method == 'None') {
      this.results = this.allResults
      console.log(this.results.length)
      this.filteredResultsByMethod = this.results
      this.numberOfPages = this.calculateNumberOfPages()
      this.createNumberOfPagesArray()
      this.updateIndexMtisView(1)
    }
    else {
      const path = 'getInfoByMethod'
      const params = new HttpParams()
        .set('method', method)

      this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
        this.results = []
        for (var i = 0; i < results.length; i++) {
          for (var j = 0; j < this.allResults.length; j++) {
            if (results[i]['mirTar_id'] == this.allResults[j]['mirTar_id']) {
              this.results.push(results[i])
            }
            //this.results.push(results[i]['mirTar_id'])
          }

        }
        console.log(this.results.length)
        this.filteredResultsByMethod = this.results
        this.numberOfPages = this.calculateNumberOfPages()
        this.createNumberOfPagesArray()
        this.updateIndexMtisView(1)
      })
    }
    //const result = this.httpRequestsService.getWithParams(path, { params })
    //result.forEach((value: IMTI) => this.filteredResultsByMethod.push(value)).then(() => {
    //console.log(this.filteredResultsByMethod[0].filter(x => !this.allResults.includes(x.mirTarId)))


    //      this.numberOfPages = this.calculateNumberOfPages(this.filteredResultsByMethod, this.numberOfMtisPerPage);
    //    this.createNumberOfPagesArray();
    //  this.updateIndexMtisView(1, this.filteredResultsByMethod);
    //}, () => console.log("error"))
  }

  filterByOrganism(organism) {
    console.log('organism')
    const path = 'getInfoByOrganism'
    const params = new HttpParams()
      .set('organism', organism)
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.results = []
      console.log(results.length)
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < this.allResults.length; j++) {
          if (results[i]['mirTar_id'] == this.allResults[j]['mirTar_id']) {
            this.results.push(results[i])
          }
          //this.results.push(results[i]['mirTar_id'])
        }

      }
      this.filteredResultsByOrganism = this.results
      this.numberOfPages = this.calculateNumberOfPages()
      this.createNumberOfPagesArray()
      this.updateIndexMtisView(1)
    })

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
