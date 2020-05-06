import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { MtiResultsComponent } from './mti-results/mti-results.component';
import { DetailedResultsComponent } from './detailed-results/detailed-results.component';
import { DownloadComponent } from './download/download.component';
import { VisualizationComponent } from './visualization/visualization.component';


const routes: Routes = [
  {path:  "", pathMatch: "full", redirectTo:  "home"},
  {path: "home", component: HomeComponent},
  {path: "search", component: SearchComponent},
  {path: "mti-results", component: MtiResultsComponent},
  {path: "detailed-results", component: DetailedResultsComponent},
  {path: "download", component: DownloadComponent},
  {path: "visualization", component: VisualizationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
