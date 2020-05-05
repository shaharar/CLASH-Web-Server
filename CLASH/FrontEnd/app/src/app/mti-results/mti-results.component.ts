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
  public filteredResultsByMethod = [];
  public filteredResultsByOrganism = [];
  public results = [];
  resultsPerPage = [];
  pagesArr = [];

  constructor(private httpRequestsService: HttpRequestsService,
    private downloadService: DownloadService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
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

    const path = 'getMTIs';
    this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
      this.allResults = results
      console.log(this.allResults)
      
     //this.downloadService.downloadFile(results, 'data', Object.keys(results[0]))
     

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

  filterByOrganism(organism) {
    console.log('organism')
    const path = 'getInfoByOrganism'
    const params = new HttpParams()
      .set('organism', organism)
   // this.httpRequestsService.getWithParams(path, { params }).subscribe((results) => {
     // this.results = []
      //console.log(results.length)
      //for (var i = 0; i < results.length; i++) {
        //for (var j = 0; j < this.allResults.length; j++) {
          //if (results[i]['mirTar_id'] == this.allResults[j]['mirTar_id']) {
            //this.results.push(results[i])
          //}
          //this.results.push(results[i]['mirTar_id'])
        //}

      //}
      //this.filteredResultsByOrganism = this.results
      //this.numberOfPages = this.calculateNumberOfPages()
      //this.createNumberOfPagesArray()
      //this.updateIndexMtisView(1)
    //})

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
