import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { HttpRequestsService } from './http-requests.service';
import { MtiResultsComponent } from './mti-results/mti-results.component';
import { DetailedResultsComponent } from './detailed-results/detailed-results.component';
import { DownloadComponent } from './download/download.component';
import { DownloadService } from './download.service';
import { VisualizationComponent } from './visualization/visualization.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    MtiResultsComponent,
    DetailedResultsComponent,
    DownloadComponent,
    VisualizationComponent,
    AboutComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [HttpRequestsService, DownloadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
