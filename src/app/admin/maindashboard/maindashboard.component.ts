import { GlobalServices } from './../../services/global-services';
import { CommonServices } from './../../services/common-services';
import { DashboardMenu } from './../../models/dashboardmenu.model';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';

@Component({
  selector: 'app-maindashboard',
  templateUrl: './maindashboard.component.html',
  styleUrls: ['./maindashboard.component.sass']
})
export class MaindashboardComponent implements OnInit, OnDestroy {


  username: string;

  displaymenuLists: DashboardMenu[];
  menuLists: [];
  solarimg = "solar";
  biomassimg = "biomass";
  windimg = "wind";
  hydroimg = "hydro";
  gisimg = "gis";
  data: any = {}
  domain: any;

  show: boolean;

  currentUser: any = {};
  userRoles: any = [];

  appsMenu: boolean;

  show_menu: boolean;
  plant: any;
  role: any;

  dialogRef: MatDialogRef<ConfirmdialogComponent>;
  appname: any;
  menuList: any;

  parentDomain: string;

  constructor(private GlobalServices: GlobalServices, public dialog: MatDialog, public snackBar: MatSnackBar, private commonService: CommonServices, private _router: Router, private overlay: Overlay) {

    this.currentUser = this.GlobalServices.getLocalItem('authentication', true)['data'];
    this.plant = this.currentUser['project']
    this.role = this.currentUser['roles'];
    this.domain = 'http://' + window.location.host + "/ui";
  }

  ngOnInit() {
    this.userRoles = this.GlobalServices.rolesdata;

    this.appname = this.currentUser['app_details']['app_name'];

    this.getDashboardList();
    this.getMenuList();

    if (this.userRoles == "ADMIN") {
      this.show = true;
      this.show_menu = true;
    } else {
      this.show = false;
      this.show_menu = false;
    }
  }

  showdiv() {
    this.appsMenu = !this.appsMenu;
  }

  getMenuList(): void {
    let obj = {
      "app_name": this.appname
    }
    this.commonService.getMenulist(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.menuList = res['details'];
      }
    },
      err => {
        console.log(err);
      });
  }


  getDashboardList(): void {
    let obj = {
      "role": this.userRoles,
      "username": this.currentUser.username
    }
    this.commonService.mainDashboardlist(obj).subscribe(res => {
      if (res['success'] == 1) {
        this.displaymenuLists = res["data"];

      } else {
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
      }
    },
      err => {

      });

  }

  getMenuID(app_name) {


    let obj = {
      "app_name": app_name
    }
    this.commonService.getAppUrl(obj).subscribe(res => {

      if (res['success'] == '1') {
        let app_id = res['data']['app_details']['app_id'];
        let app_url = res['data']['app_details']['app_url'];

        let btoa_data = btoa(JSON.stringify(res));
        let atob_token = atob(btoa_data);

        this.parentDomain = localStorage.getItem('redirect_usermngt');

        if (app_name == "DGR") {

          //global server
          window.location.href = app_url + "/reload?code=" + app_id + "&response_type=" + btoa_data + "&redirect_uri=" + this.parentDomain;

          //local server
          //window.location.href = "http://localhost:5002/reload?code="+app_id+"&response_type=" + btoa_data + "&redirect_uri=" + this.parentDomain;

        } else {
          this.snackBar.open("Coming Soon..", "close", {
            duration: 2000,
          });
        }

      } else if (res['success'] == '0') {
        this.snackBar.open(res['message'], "close", {
          duration: 2000,
        });
      }
    },
      err => {

      });
  }

  deleteProject(id) {

    this.dialogRef = this.dialog.open(ConfirmdialogComponent, {
      disableClose: false
    });

    this.dialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "*Note: If you delete the project will be deleted."
      ;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let deleteObj = {
          params: {
            "id": id
          }
        }
        this.commonService.deleteProject(deleteObj).subscribe(res => {
          if (res['success'] == 1) {
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });
            this.getDashboardList();

          } else {
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });
          }
        },
          err => {

          });
      }
      this.dialogRef = null;
    });
  }

  getDashboard(menu: DashboardMenu): void {

    const projectname = menu.project_name;
    const projecttype = menu.project_type;

    if (projecttype == "solar") {
      this._router.navigate(['/solar-tree']);
      this.getLocalStorage(projectname, projecttype);
    } else if (projecttype == "wind") {
      this._router.navigate(['/wind-tree']);
      this.getLocalStorage(projectname, projecttype);
    } else if (projecttype == "hydro") {
      this._router.navigate(['/hydro']);
      this.getLocalStorage(projectname, projecttype);
    } else if (projecttype == "gis") {
      this._router.navigate(['/gis']);
      this.getLocalStorage(projectname, projecttype);;
    } else if (projecttype == "biomass") {
      this._router.navigate(['/biomass']);
      this.getLocalStorage(projectname, projecttype);
    } else {
      this.snackBar.open("No Project Type", "close", {
        duration: 2000,
      });
    }
  }

  getLocalStorage(projectname, projecttype) {

    localStorage.setItem('project_name', projectname);
    localStorage.setItem('project_type', projecttype);

    const dataitem = {
      "projectname": projectname,
      "projecttype": projecttype
    }

    localStorage.setItem('project_dataitem', JSON.stringify(dataitem));

  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {

      this.getDashboardList();
    });
  }

  openUserMngt() {
    this.GlobalServices.userManagementPage();
  }

  editProject(menu) {

    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: menu
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDashboardList();
    });
  }

  public userLogout() {
    this.GlobalServices.logout();
  }

  ngOnDestroy(): void {
    //alert(`I'm leaving the app!`);
    /* this.GlobalServices.removeLocalItem('authentication')
    this.GlobalServices.authenticationFailed(); */
  }

  /* @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    this.GlobalServices.removeLocalItem('authentication')
    this.GlobalServices.authenticationFailed();
  } */

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    //alert('By refreshing this page you may lost all data.');
    //this.GlobalServices.removeLocalItem('authentication')
    //this.GlobalServices.authenticationFailed();
  }
}
