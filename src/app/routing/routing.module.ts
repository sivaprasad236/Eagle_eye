import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuard } from '../services/auth-guard-service';

/* const appRoutes: Routes = [
  {path: '', redirectTo: 'admin/home', pathMatch: 'full'},
  {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'},
  {path: 'admin', loadChildren: '../admin/admin.module#AdminModule', canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/auth/login'}
]; */

const appRoutes: Routes = [
  {path: '', redirectTo: 'maindashboard', pathMatch: 'full'},
  {path: '', loadChildren: '../auth/auth.module#AuthModule'},
  {path: '', loadChildren: '../admin/admin.module#AdminModule', canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/reload'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class RoutingModule {

}
