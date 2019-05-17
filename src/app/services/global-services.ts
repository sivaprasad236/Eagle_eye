import { environment } from "../../environments/environment";
import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import * as moment from 'moment';
import _ from 'lodash';
import { MatSnackBar } from "@angular/material";

@Injectable()
export class GlobalServices implements OnInit {
    apiToken = "";
    authentication = null;
    serverDateFormat = "DD-MMM-YYYY HH:MM";
    rolesdata: any = {};

    currentDomain = 'http://' + window.location.host+'/ui';

    userRoles:any={}

    public onInvalidApiToken: EventEmitter<any>;
    public onLogOut: EventEmitter<any>;
    pageSize = 10;
   pageSizeOptions = [5, 10, 25, 100];
    
    constructor(
        private router: Router,
        public snackBar: MatSnackBar
    ) {
        this.init();
        //this.getUserRoles();
        this.onInvalidApiToken = new EventEmitter();
    this.onLogOut = new EventEmitter();
    }
    ngOnInit() {
        //this.removeLocalItem('authentication');
    }

    /**
     * Api Urls
     */
    public ApiUrls() {
        return {
            'userLogin': environment.API_URL + '/login',
            
            //user management
            'getRoleslist': environment.API_URL + '/roleslist',
            'getaddProjectslist': environment.API_URL + '/addprojectslist',
            'getUserlist': environment.API_URL + '/userlist',
            'getRolesUserlist': environment.API_URL + '/rolesuser',
            'addUserManagement': environment.API_URL + '/addUsermngt',
            'deleteUserManagement': environment.API_URL + '/deleteUsermngt',

            //Dashboard - create project
            'createProject': environment.API_URL + '/createproject',
            'getProjectType': environment.API_URL + '/projecttype',
            'getDashboardProjectsList': environment.API_URL + '/projectname',
            'mainDashboardlist': environment.API_URL + '/dashboard',
            'deleteProject': environment.API_URL + '/deleteproject',
            'editProject': environment.API_URL + '/editproject',

            //solar or wind or gis
            'uploadFile': environment.API_URL + '/upload',
            'addUploadFile': environment.API_URL + '/addimages',
            'getDataRetrieval': environment.API_URL + '/dataretrieval',
            'getDropdown': environment.API_URL + '/processtype',
            'getViewimage': environment.API_URL + '/viewimages',
            'setSolarProcess': environment.API_URL + '/solarprocess',
            'getInverterslist': environment.API_URL + '/inverterslist',
            'getViewmaps': environment.API_URL + '/viewmaps',
            'getSolar': environment.API_URL + '/solar_tree/plant/',
            'getWind': environment.API_URL + '/wind_tree/plant/',
            'getMenulist': environment.API_URL + '/application_list',
            'getAppUrl': environment.API_URL + '/userprojects',
            //'getSolarTree': this.dummy_url + '/solar_tree/plant/{plantname}',
        

            //old
            'processFile': environment.API_URL + '/Process',
            'dataRetrieval': environment.API_URL + '/dataretrieval',
            'viewMap': environment.API_URL + '/viewmap',
            'displayImages': environment.API_URL + '/display_images',
            'unidentifiedSolar': environment.API_URL + '/unidentified',

            'report': environment.API_URL + '/userinputs',
            'getAppList': environment.API_URL + '/application_list',
            'userprojects': environment.API_URL + '/userprojects',
            'getInverterNames':environment.API_URL + '/invertersnames_drpdown/{plant_id}',
            'getInverterdropdown': environment.API_URL + '/inverters_drpdown',
            'getReports': environment.API_URL + '/comments_retrival',
            'editReport': environment.API_URL + '/solarcomments_update',
            'getwtgs': environment.API_URL + '/wind_names_drpdwn/{id}',
            'getWtgTypes': environment.API_URL + '/wind_drpdown'
        }
    }
    invalidApiToken(): void {
        // this.onInvalidApiToken.emit(true);
        this.logout();
    }

    public getCurrentDate = function (format) {
        if (!format) {
            let format = this.serverDateFormat;
        }
        return moment().format(format);
    }

    public formatDate = function (date, format) {
        return moment(date).format(format);
    }

    public isValidDate = function (val, format) {
        if (format) {
            return moment(val, format).isValid();
        } else {
            return moment(val).isValid();
        }
    }

    public checkRole = function (router) {
        return this.userRoles[router];
    }

    hasValidIdToken(): boolean {
        const data = this.getLocalItem('authentication', true);
        return (data) ? true : false;
    }

    logout(): void {
        this.removeLocalItem('authentication');
        let domain = localStorage.getItem('redirect_usermngt');
        window.location.href = domain + '/login?logout=logout'
        this.init();
    }

    showErrorMessage(err): void {
        let msg;
        if (err && err.errors) {
          msg = err.errors[0].message;
        } else {
          msg = err.message;
        }
        //this.messageService.add({severity: 'error', detail: msg});
      }
    
      showSuccessMessage(obj): void {
        this.snackBar.open(obj, 'Close', 
        { duration: 3000, verticalPosition: 'top', 
        panelClass: ['snack-success' ]})
      }
    
    public init = function () {
        this.apiToken = "";
        this.authentication = null;
        var data = this.getLocalItem("authentication", true);
        if (data) {
            this.authentication = data['data'];
            this.apiToken = this.authentication['token'];
            this.rolesdata = this.authentication['app_details']['roles'];
        }
    }
    public setLocalItem = function (key, value, encoded) {
        value = JSON.stringify(value);
        if (encoded) {
            value = btoa(value)
        }
        localStorage.setItem(key, value);
    }
    public removeLocalItem = function (key) {
        localStorage.removeItem(key);
    }
    public getLocalItem = function (key, decoded) {
        var value = localStorage.getItem(key);
        value = (value) ? JSON.parse((decoded) ? atob(value) : value) : null;
        return value;
    }

    public getLoginAuthorization = function (val) {
        val = btoa(val);
        let authorization = {
            'Authorization': 'Token ' + val
        }
        return authorization;
    }

    public getAuthorization = function () {
        let authorization = {
            'Authorization': 'Token ' + this.apiToken
        }
        return authorization;

    }

    public objToQueryString = function (obj) {
        let k = Object.keys(obj);
        let s = "";
        for (var i = 0; i < k.length; i++) {
            s += k[i] + "=" + encodeURIComponent(obj[k[i]]);
            if (i != k.length - 1) s += "&";
        }
        return s;
    };
    public authenticationFailed() {
        //this.router.navigate(['/login']);
    }

    public userManagementPage() {
        let usermngt = localStorage.getItem('redirect_usermngt');
        console.log(usermngt+"/user-management");
        let btoa_domain = btoa(JSON.stringify(this.currentDomain));
        window.location.href = usermngt+"/user-management?redirect="+btoa_domain;
    }


}