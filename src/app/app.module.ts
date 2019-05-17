import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { RoutingModule } from './routing/routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from './models/data.model';
import { CommonServices } from './services/common-services';
import { GlobalServices } from './services/global-services';
import { HttpServices } from './services/http-services';
import { AuthGuard } from './services/auth-guard-service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CommonServices,
    GlobalServices,
    HttpServices,
    AuthGuard,
    DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
