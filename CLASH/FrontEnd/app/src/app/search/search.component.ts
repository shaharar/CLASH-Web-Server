import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';
import { Router, NavigationExtras } from '@angular/router'



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

 
  constructor(private httpRequestsService: HttpRequestsService,
    private router: Router) { }

    
  ngOnInit(): void {
  }

  getMTIByMirnaName(mirnaName): void {
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.values = JSON.stringify([mirnaName]);
    queryParams.searchInput = 'mirnaName'
    queryParams.path = 'getInfoByMir'
    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // Navigate to component mti-results
    this.router.navigate(['/mti-results'], navigationExtras);
  }


  getMTIByTargetName(targetName): void {
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.values = JSON.stringify([targetName]);
    queryParams.searchInput = 'targetName'
    queryParams.path = 'getInfoByTarget'
    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // Navigate to component mti-results
    this.router.navigate(['/mti-results'], navigationExtras);
  }

  getMTIByOrganism(organism): void {
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.values = JSON.stringify([organism]);
    queryParams.searchInput = 'organism'
    queryParams.path = 'getInfoByOrganism'
    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // Navigate to component mti-results
    this.router.navigate(['/mti-results'], navigationExtras);
  }

  getMTIByMirTar(mirnaName,targetName): void {
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.values = JSON.stringify([mirnaName, targetName]);
    queryParams.searchInput = 'mirTar'
    queryParams.path = 'getInfoByMirTar'
    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // Navigate to component mti-results
    this.router.navigate(['/mti-results'], navigationExtras);
  }

}
