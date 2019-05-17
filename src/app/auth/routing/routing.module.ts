import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AdminModule } from '../../admin/admin.module';

const authRoutes: Routes = [
  {path: '', redirectTo: 'reload', pathMatch: 'full'},
  {path: 'reload', component: LoginComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {
}
