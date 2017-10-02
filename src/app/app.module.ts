import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OnMount, DynamicHTMLModule } from 'ng-dynamic';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AppComponent } from './app.component';
import { CcdaViewerComponent } from './ccda-viewer/ccda-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    CcdaViewerComponent
  ],
  imports: [
    BrowserModule,
    DynamicHTMLModule.forRoot({
      components: [
      ]
    }),
    LocalStorageModule.withConfig({
      storageType: 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
