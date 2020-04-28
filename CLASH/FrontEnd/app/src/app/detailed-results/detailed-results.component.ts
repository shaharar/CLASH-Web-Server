import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-results',
  templateUrl: './detailed-results.component.html',
  styleUrls: ['./detailed-results.component.css']
})
export class DetailedResultsComponent implements OnInit {

  public mirTarId = "P1234";
  public generalInfoArr =[{method: 'vienna', organism: 'human', full_mrna: 'full'}]
  constructor() { }

  ngOnInit(): void {
  }

}
