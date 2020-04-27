import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mti-results',
  templateUrl: './mti-results.component.html',
  styleUrls: ['./mti-results.component.css']
})
export class MtiResultsComponent implements OnInit {

  numberOfMtisPerPage = 6;
  numberOfPages;
  firstIndexMtiPage = 0;
  lastIndexMtiPage = 0;
  allResults = ["P0", "P1", "P2", "P3", "P4",
            "P5", "P6", "P7", "P8", "P9",
            "P10", "P11", "P12", "P13", "P14"];
  
  resultsPerPage = [];
  pagesArr = [];

  constructor() { }

  ngOnInit(): void {
    this.numberOfPages = this.calculateNumberOfPages(this.allResults, this.numberOfMtisPerPage);
    this.createNumberOfPagesArray(); 
    this.updateIndexMtisView(1);
    // console.log(this.numberOfPages);
    // console.log(this.firstIndexMtiPage);
    // console.log(this.lastIndexMtiPage);
  }
  createNumberOfPagesArray() {
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

  calculateNumberOfPages (allResults, numberOfMtisPerPage) {
    return Math.ceil(allResults.length / numberOfMtisPerPage);
  }

  updateIndexMtisView (pageNumber) {
    this.firstIndexMtiPage = this.getFirstIndexMtiPage(this.numberOfMtisPerPage, pageNumber);
    this.lastIndexMtiPage = this.getLastIndexMtiPage(this.firstIndexMtiPage, this.numberOfMtisPerPage);
    this.addResultsPerPage();
  }

  addResultsPerPage () {
    this.resultsPerPage = [];
    for (var i = this.firstIndexMtiPage; i <= this.lastIndexMtiPage; i++) {
        if (typeof this.allResults[i] != "undefined") {
            this.resultsPerPage.push(this.allResults[i]);
        }
    }
  }
}
