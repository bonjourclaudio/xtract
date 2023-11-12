import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EspressoComponent } from './espresso/espresso.component';
import { HttpClientModule } from '@angular/common/http';
import { VisualComponent } from './visual/visual.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EspressoComponent,
    VisualComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
