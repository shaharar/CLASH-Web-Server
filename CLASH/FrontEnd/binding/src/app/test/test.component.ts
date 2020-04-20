import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-test',
 // templateUrl: './test.component.html',
  template: `<h1> welcome {{name}} </h1>
            <h2> {{greetUser()}} </h2>
            <h2> {{siteUrl}} </h2>
            <h2 [class]="sucessClass"> Codevolution </h2>
            <h2 [ngClass]="messageClasses"> Codevolution </h2>

            <h2> {{"Hello " + parentData}} </h2>
            `,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public name = "CLASH";
  public siteUrl = window.location.href;
  public sucessClass = "text-danger";
  public hasError = false;
  public isSpecial = true;
  public messageClasses = {
    "text-success": !this.hasError,
    "text-danger": this.hasError,
    "text-special": this.isSpecial
  }

  @Input() public parentData;

  constructor() { }

  ngOnInit(): void {
  }

  greetUser() {
    return "hello " + this.name;
  }

}
