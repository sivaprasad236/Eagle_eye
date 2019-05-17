import { AddUserManagementComponent } from './user-management/add-user-management/add-user-management.component';
import { BiomassComponent } from './dashboard/biomass/biomass.component';
import { WindComponent } from './dashboard/wind/wind.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbedVideo } from 'ngx-embed-video';
import {BrowserModule} from '@angular/platform-browser';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { RootComponent } from './root/root.component';
import { SolarComponent } from './dashboard/solar/solar-dashboard.component';
import { UnIdentifiedComponent } from './un-identified/un-identified.component';
import { SharedModule } from '../shared/shared.module';
import { RoutingModule } from './routing/routing.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { MatVideoModule } from 'mat-video';
import { AngularImageAnnotatorModule } from 'angular-image-annotator';
import { MapComponent } from './map/map.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaindashboardComponent } from './maindashboard/maindashboard.component';
import { CreateProjectDialogComponent } from './maindashboard/create-project-dialog/create-project-dialog.component';
import { HydroComponent } from './dashboard/hydro/hydro.component';
import { WindTreeComponent } from './dashboard/wind-tree/wind-tree.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { DialogWindtreeComponent } from './dashboard/wind-tree/dialog-windtree/dialog-windtree.component';
import { ViewimageComponent } from './viewimage/view-image';
import { GISComponent } from './dashboard/gis/gis-dashboard.component';
import { EditProjectDialogComponent } from './maindashboard/edit-project-dialog/edit-project-dialog.component';
import { AddUploadImageComponent } from './dashboard/adduploadimage-dialog/adduploadimage-dialog';
import { SolarTreeComponent } from './dashboard/solar-tree/solar-tree.component';
import { MenuService } from './menu.service';
import { PotreeComponent } from './potree/potree.component';
import { ImageEditingComponent } from './dashboard/image-editing/image-editing.component';


@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxGalleryModule,
    EmbedVideo,
    MatVideoModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AngularImageAnnotatorModule
    
  ],
  declarations: [
    MaindashboardComponent,
    RootComponent, 
    SolarComponent, 
    UnIdentifiedComponent, 
    GISComponent, 
    HydroComponent,
    WindComponent,
    BiomassComponent,
    MapComponent, 
    CreateProjectDialogComponent, 
    WindTreeComponent, 
    UserManagementComponent, 
    ConfirmdialogComponent,
    AddUserManagementComponent,
    DialogWindtreeComponent,
    ViewimageComponent,
    EditProjectDialogComponent,
    AddUploadImageComponent,
    SolarTreeComponent,
    PotreeComponent,
    ImageEditingComponent,
  ],
  providers: [MenuService],
  entryComponents: [AddUploadImageComponent,
                    DialogWindtreeComponent, 
                    MapComponent, 
                    CreateProjectDialogComponent, 
                    EditProjectDialogComponent,
                    ConfirmdialogComponent, 
                    AddUserManagementComponent,
                    ImageEditingComponent]

})
export class AdminModule {

  
}
