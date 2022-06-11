import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { VideoComponent } from '../video/video.component';

const routes: Routes = [
  {path:'', redirectTo: "/video", pathMatch: "full"},
  {path:"video", component:VideoComponent},
  {path:"thanks", component:ThankyouComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,{enableTracing:false,useHash:true})
  ],
  declarations: []
})
export class AppRoutingModuleModule { }