import { ViewimageComponent } from './../viewimage/view-image';
import { WindTreeComponent } from './../dashboard/wind-tree/wind-tree.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from '../root/root.component';
import { UnIdentifiedComponent } from '../un-identified/un-identified.component';

import { MaindashboardComponent } from '../maindashboard/maindashboard.component';
import { SolarComponent } from '../dashboard/solar/solar-dashboard.component';
import { HydroComponent } from '../dashboard/hydro/hydro.component';
import { WindComponent } from '../dashboard/wind/wind.component';
import { BiomassComponent } from '../dashboard/biomass/biomass.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { GISComponent } from '../dashboard/gis/gis-dashboard.component';
import { SolarTreeComponent } from '../dashboard/solar-tree/solar-tree.component';
import { PotreeComponent } from '../potree/potree.component';


const adminRoutes: Routes = [
  {path: 'maindashboard', component: MaindashboardComponent},
  {path: 'user-management', component: UserManagementComponent},
  {path: '', component: RootComponent, children: [
    {path: 'solar', component: SolarComponent},
    {path: 'un-identified', component: UnIdentifiedComponent},
    {path: 'viewimage', component: ViewimageComponent},
    {path: 'solar-tree', component: SolarTreeComponent},
    {path: 'wind-tree', component: WindTreeComponent},
    {path: 'wind', component: WindComponent},
    {path: 'hydro', component: HydroComponent},
    {path: 'gis', component: GISComponent},
    {path: 'biomass', component: BiomassComponent},
    {path: 'video', component: PotreeComponent}
  ]}
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
