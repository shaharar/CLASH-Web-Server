import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
//  templateUrl: './app.component.html',
 template: `<app-header></app-header>
            <router-outlet></router-outlet>
            <app-footer></app-footer>
           `,

  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
