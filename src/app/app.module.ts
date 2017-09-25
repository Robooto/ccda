import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OnMount, DynamicHTMLModule } from 'ng-dynamic';

import { AppComponent } from './app.component';
import { CcdaViewerComponent } from './ccda-viewer/ccda-viewer.component';
import { MyAwesomeButtonComponent } from './my-awesome-button/my-awesome-button.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CcdaViewerComponent,
    MyAwesomeButtonComponent,
    PatientDetailComponent
  ],
  imports: [
    BrowserModule,
    DynamicHTMLModule.forRoot({
      components: [
        // { component: PatientDetailComponent, selector: 'patient-detail' },
      ]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
