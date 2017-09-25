import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OnMount, DynamicHTMLModule } from 'ng-dynamic';

import { AppComponent } from './app.component';
import { CcdaViewerComponent } from './ccda-viewer/ccda-viewer.component';
import { MyAwesomeButtonComponent } from './my-awesome-button/my-awesome-button.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';

@NgModule({
  declarations: [
    AppComponent,
    CcdaViewerComponent,
    MyAwesomeButtonComponent,
    PatientInfoComponent
  ],
  imports: [
    BrowserModule,
    DynamicHTMLModule.forRoot({
      components: [
        { component: MyAwesomeButtonComponent, selector: 'my-awesome-button' },
      ]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
