import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModuleModule } from './app-routing-module.module';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { VideoComponent } from '../video/video.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModuleModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
  ],
  declarations: [AppComponent, ThankyouComponent, VideoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
