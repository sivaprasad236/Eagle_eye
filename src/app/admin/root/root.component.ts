import { MatSnackBar } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';
import { GlobalServices } from './../../services/global-services';
import { CommonServices } from './../../services/common-services';
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { MenuService } from '../menu.service';


@Component({
  selector: "app-root",
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('100ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateX(-100%)', opacity: 1}))
        ])
      ]
    )
  ],
  templateUrl: "./root.component.html",
  styleUrls: ["./root.component.sass"]
})
export class RootComponent implements OnInit {

  currentUser: any = {};

  project_type: string;

  project_dataitem1: any;
  project_dataitem: any;

  appname: any;
  menuList: any;
  appsMenu: boolean;
  sideMenu: boolean = false;
  
  purTransMenu: boolean = false;
  purReportsMenu: boolean = false;
  mobileMenu: boolean = false;
  inventoryMenu: boolean = false;
  settingsMenu: boolean = false;
  purchasingMenu: boolean = false;
  inventoryTransMenu:boolean = false;
  inventoryReportsMenu:boolean = false;
  inventoryMasterDataMenu:boolean = false;

  currentSideMenu:boolean=false;
  gisMenuItem: boolean=false;
  windMenuItem: boolean=false;
  solarMenuItem: boolean=true;
  hydroMenuItem: boolean=false;

  parentDomain: string;
  show: boolean = true;

  constructor(public snackBar: MatSnackBar, private router: Router, private menuService: MenuService, private commonService: CommonServices, private GlobalServices: GlobalServices) {
    
  }

  ngOnInit() {
    
    this.currentUser = this.GlobalServices.getLocalItem('authentication',true)['data'];
    this.appname = this.currentUser['app_details']['app_name'];
    this.getMenuList();

    this.project_type = localStorage.getItem('project_type');

    if(this.project_type == "solar"){
      this.solarMenuItem=true;
      this.gisMenuItem=false;
      this.windMenuItem=false;
      this.hydroMenuItem=false;
    }else if(this.project_type == "wind"){
      this.solarMenuItem=false;
      this.gisMenuItem=false;
      this.windMenuItem=true;
      this.hydroMenuItem=false;
    } else if(this.project_type == "hydro"){
      this.solarMenuItem=false;
      this.gisMenuItem=false;
      this.windMenuItem=false;
      this.hydroMenuItem=true;
    }else if(this.project_type == "gis"){
      this.solarMenuItem=false;
      this.gisMenuItem=true;
      this.windMenuItem=false;
      this.hydroMenuItem=false;
    }else if(this.project_type == "biomass"){
      this.solarMenuItem=false;
      this.gisMenuItem=true;
      this.windMenuItem=false;
      this.hydroMenuItem=false;
    }
  }

  showdiv(){
    this.appsMenu= !this.appsMenu;
  }

  getMenuList(): void{
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

 
  toggleSide() {
    this.sideMenu = !this.sideMenu;
  }
  
  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
  }
 
  public userLogout(){
    this.GlobalServices.logout();
  }
  show1(){
    this.show = !this.show
  }
}
