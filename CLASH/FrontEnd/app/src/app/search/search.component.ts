import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';
import { Router, NavigationExtras } from '@angular/router'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public mirnaName = "";
  public mirnaSeq = "";
  public targetName = "";
  public dataset = "";
  public DBVersion = "";
  public methodInputs: any;
  public organismInputs: any;
  public mrnaRegionInputs: any;
  public protocolInputs: any;
  
  public allOrganisms = [];
  public allMethods = [];
  public allMrnaRegions = [];
  public allProtocols = [];

  public masterSelectedOrganism = false;
  public masterSelectedMethod = false;
  public masterSelectedRegion = false;
  public masterSelectedProtocol = false;

  public checkListOrganism = [];
  public checkListMethod = [];
  public checkListMrnaRegion = [];
  public checkListProtocol = [];


  constructor(private httpRequestsService: HttpRequestsService,
    private router: Router) {
      this.allOrganisms = ['Human','Mouse','Cattle','Celegans'];
      this.allMethods = ['Vienna','Miranda','Hybrid'];
      this.allMrnaRegions = ['3’UTR','CDS'];
      this.allProtocols = ['CLASH','ClearCLIP','PAR-CLIP','Endogenous Ligation'];
      this.initialCheckLists();
    }

    
  ngOnInit(): void {
  }

  initialCheckLists() {
    //initial organism checklist
    this.allOrganisms.forEach(organism => {
      this.checkListOrganism.push({
        value: organism,
        isSelected: false
      });
    });  
    this.getCheckedItemList('organism');
    //initial method checklist
    this.allMethods.forEach(method => {
      this.checkListMethod.push({
        value: method,
        isSelected: false
      });
    });  
    this.getCheckedItemList('method');
    //initial mrnaRegion checklist
    this.allMrnaRegions.forEach(region => {
      this.checkListMrnaRegion.push({
        value: region,
        isSelected: false
      });
    });  
    this.getCheckedItemList('mrnaRegion');
    //initial protocol checklist
    this.allProtocols.forEach(protocol => {
      this.checkListProtocol.push({
        value: protocol,
        isSelected: false
      });
    });  
    this.getCheckedItemList('protocol');
  }
  checkUncheckAll(type) {
    switch (type) {
      case 'organism':
        for (var i = 0; i < this.checkListOrganism.length; i++) {
          this.checkListOrganism[i].isSelected = this.masterSelectedOrganism;
        }
        break;
      case 'method':
        for (var i = 0; i < this.checkListMethod.length; i++) {
          this.checkListMethod[i].isSelected = this.masterSelectedMethod;
        }
        break;
      case 'protocol':
        for (var i = 0; i < this.checkListProtocol.length; i++) {
          this.checkListProtocol[i].isSelected = this.masterSelectedProtocol;
        }
        break;
      case 'mrnaRegion':
        for (var i = 0; i < this.checkListMrnaRegion.length; i++) {
          this.checkListMrnaRegion[i].isSelected = this.masterSelectedRegion;
        }
        break;
      default:
      break;
    }
    this.getCheckedItemList(type);
  }

  isAllSelected(type) {
    switch (type) {
      case 'organism':
        this.masterSelectedOrganism = this.checkListOrganism.every(function(item:any) {
          return item.isSelected == true;
        })        
        break;
      case 'method':
        this.masterSelectedMethod = this.checkListMethod.every(function(item:any) {
          return item.isSelected == true;
        })   
        break;
      case 'protocol':
        this.masterSelectedProtocol = this.checkListProtocol.every(function(item:any) {
          return item.isSelected == true;
        })   
        break;
      case 'mrnaRegion':
        this.masterSelectedRegion = this.checkListMrnaRegion.every(function(item:any) {
          return item.isSelected == true;
        })   
        break;
        default:
        break;
    }
    this.getCheckedItemList(type);
  }
 
  getCheckedItemList(type){
    switch (type) {
      case 'organism':
        this.organismInputs = [];
        for (var i = 0; i < this.checkListOrganism.length; i++) {
          if(this.checkListOrganism[i].isSelected){
            this.organismInputs.push(this.checkListOrganism[i]);    
          }
        }            
        console.log(this.organismInputs);
        break;
      case 'method':
        this.methodInputs = [];
        for (var i = 0; i < this.checkListMethod.length; i++) {
          if(this.checkListMethod[i].isSelected){
            this.methodInputs.push(this.checkListMethod[i]);    
          }
        }            
        console.log(this.methodInputs);
        break;
      case 'protocol':
        this.protocolInputs = [];
        for (var i = 0; i < this.checkListProtocol.length; i++) {
          if(this.checkListProtocol[i].isSelected){
            this.protocolInputs.push(this.checkListProtocol[i]);    
          }
        }            
        console.log(this.protocolInputs);
        break;
      case 'mrnaRegion':
        this.mrnaRegionInputs = [];
        for (var i = 0; i < this.checkListMrnaRegion.length; i++) {
          if(this.checkListMrnaRegion[i].isSelected){
            this.mrnaRegionInputs.push(this.checkListMrnaRegion[i]);    
          }
        }            
        console.log(this.mrnaRegionInputs);
        break;
      default:
      break;
    }
  }

  getMTIs() {
    console.log(this.dataset);
    const queryParams: any = {};
    // Add the array of values to the query parameter as a JSON string
    queryParams.mirnaName = this.mirnaName;
    queryParams.mirnaSeq = this.mirnaSeq;
    queryParams.targetName = this.targetName;
    queryParams.dataset = this.dataset;
    queryParams.DBVersion = this.DBVersion;
    queryParams.organismInputs = JSON.stringify([this.checkEmptyInputsArr(this.organismInputs,'organism')]);
    queryParams.methodInputs = JSON.stringify([this.checkEmptyInputsArr(this.methodInputs,'method')]);
    queryParams.mrnaRegionInputs = JSON.stringify([this.checkEmptyInputsArr(this.mrnaRegionInputs,'mrnaRegion')]);
    queryParams.protocolInputs = JSON.stringify([this.checkEmptyInputsArr(this.protocolInputs,'protocol')]);

    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // Navigate to component mti-results
    this.router.navigate(['/mti-results'], navigationExtras);
  }

  checkEmptyInputsArr(inputs, type) {
    //if inputs array is empty (the user didn't choose any checkbox) - search should be by all items
    if (inputs.length == 0) {
      switch (type) {
        case 'organism':
          return this.allOrganisms;
        case 'method':
          return this.allMethods;
        case 'protocol':
          return this.allProtocols;
        case 'mrnaRegion':
          return this.allMrnaRegions;
      }
    }
    else {
      return inputs.map(item => item.value);
    }
  }


  // onChange(organism, isChecked){
  //   // console.log(this.organismInputs);
  //   if (isChecked == true) {
  //     this.organismInputs.push(organism);
  //   }
  //   else {
  //     const index = this.organismInputs.indexOf(organism, 0);
  //     if (index > -1) {
  //       this.organismInputs.splice(index, 1);
  //     }
  //   }    
  //   console.log(this.organismInputs);
  // }

  // onChangeAll(isChecked){
  //   // console.log(this.organismInputs);
  //   if (isChecked == true) {
  //     this.allOrganisms.forEach(organism => {
  //       this.organismInputs.push(organism);
  //     });
  //   }
  //   else {
  //     this.organismInputs = [];
  //   }    
  //   console.log(this.organismInputs);
  // }
}
