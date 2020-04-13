import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
 // templateUrl: './test.component.html',
  template: `<h1>
              welcome {{name}}
            </h1>
            `,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public name = "CLASH";
  constructor() { }

  ngOnInit(): void {
  }

}
