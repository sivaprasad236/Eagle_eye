import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalServices } from '../services/global-services';
import { HttpServices } from './http-services';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { UploadModel } from '../models/upload.model';

//Get data asynchronously with Observable
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginModel } from '../models/login.model';
import { DisplayImageModel } from '../models/viewimage.model';

@Injectable()

export class CommonServices {
  
    constructor(private GlobalServices:GlobalServices,private HttpServices:HttpServices, private http: HttpClient,) {
      
     }

    /* userlogin(obj) {
        let url = this.GlobalServices.ApiUrls().userLogin;
        let val = obj.username + ':' + obj.password;
        let header = this.GlobalServices.getLoginAuthorization(val);
        let $request = this.HttpServices.httpLogin(url, header);

        return $request;
    }; */

    getRoleslist(obj){
      let url = this.GlobalServices.ApiUrls().getRoleslist;
      return this.HttpServices.httpRequest({ url, method: 'P', ...obj });
    }


    getaddProjectslist(obj){
      let url = this.GlobalServices.ApiUrls().getaddProjectslist;
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj });
    }

    getUserlists(obj){
        let url = this.GlobalServices.ApiUrls().getUserlist;
        return this.HttpServices.httpRequest({ url, method: 'P', ...obj });
    }

    getRolesUserlist(obj){
        let url = this.GlobalServices.ApiUrls().getRolesUserlist;
        return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    addUserManagement(obj){
        let url = this.GlobalServices.ApiUrls().addUserManagement;
        return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    deleteUserManagement(obj) {
        let url = this.GlobalServices.ApiUrls().deleteUserManagement;
        let $request = this.HttpServices.httpRequest({url, method:'D', params:obj, ...obj});
        return $request;
    }

    getProjectType(obj){
      let url = this.GlobalServices.ApiUrls().getProjectType;
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj });
    }

    getDashboardProjectsList(obj){
      let url = this.GlobalServices.ApiUrls().getDashboardProjectsList;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    createProject(obj){
      let url = this.GlobalServices.ApiUrls().createProject;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    mainDashboardlist(obj){
      let url = this.GlobalServices.ApiUrls().mainDashboardlist;
      return this.HttpServices.httpRequest({ url, method: 'G', params:obj, ...obj });
    }

    uploadImageFile(obj){
      let url = this.GlobalServices.ApiUrls().uploadFile;
      return this.HttpServices.httpRequest({ url, method: 'F', data:obj, ...obj });
    }

    addUploadFile(obj){
      let url = this.GlobalServices.ApiUrls().addUploadFile;
      return this.HttpServices.httpRequest({ url, method: 'F', data:obj, ...obj });
    }

    setSolarProcess(obj){
      let url = this.GlobalServices.ApiUrls().setSolarProcess;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    getInverterslist(obj){
      let url = this.GlobalServices.ApiUrls().getInverterslist;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    getViewmaps(obj){
      let url = this.GlobalServices.ApiUrls().getViewmaps;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    getMenulist(obj){
      let url = this.GlobalServices.ApiUrls().getMenulist;
      return this.HttpServices.httpRequest({ url, method: 'G', params:obj, ...obj });
    }

    getAppUrl(obj){
      let url = this.GlobalServices.ApiUrls().getAppUrl;
      return this.HttpServices.httpRequest({ url, method: 'G', params:obj, ...obj });
    }

    /* getSolarTree(obj){
      let url = this.GlobalServices.ApiUrls().getSolarTree.replace('{plantname}', obj['plantname']);
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    } */


    /* uploadImageFileOld(formdata: FormData){
      let uploadFileurl = this.GlobalServices.ApiUrls().uploadFile;

      let httpHeaders = new HttpHeaders()
              .set('Authorization', this.apiToken)
              .set('Content-Type', 'multipart/form-data')
              .set('Accept', 'application/json');

      console.log(this.apiToken);
      
      let $request = this.http.post(uploadFileurl, formdata, {headers:httpHeaders});
      return $request;
    } */

    getDataRetrieval(obj){
      let url = this.GlobalServices.ApiUrls().getDataRetrieval;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    getDropdown(obj){
      let url = this.GlobalServices.ApiUrls().getDropdown;
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj });
    }

    getViewimage(obj){
      let url = this.GlobalServices.ApiUrls().getViewimage;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    deleteProject(obj){
      let url = this.GlobalServices.ApiUrls().deleteProject;
      return this.HttpServices.httpRequest({ url, method: 'D', ...obj });
    }

    editProject(obj){
      let url = this.GlobalServices.ApiUrls().editProject;
      return this.HttpServices.httpRequest({ url, method: 'P', data:obj, ...obj });
    }

    




  //old

  /* uploadImageFile(formdata: FormData){
    let uploadFileurl = this.GlobalServices.ApiUrls().uploadFile;

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    
    let $request = this.http.post(uploadFileurl, formdata, {headers:headers, reportProgress: true, observe: 'events'});
    return $request;
  } */
     
    
      uploadFileProcess() {
        let processurl = this.GlobalServices.ApiUrls().processFile;
        return this.http.get(processurl);
      }
    
      /* getUploadLists(datavalue): Observable<UploadModel[]> {
        
        let dataretrievalurl = this.GlobalServices.ApiUrls().dataRetrieval;
        return this.http.post<UploadModel[]>(dataretrievalurl, datavalue).pipe(
          tap(datarectrival => console.log(`datavalue = ${JSON.stringify(datarectrival)}`)),
          catchError(error => of([]))
        );
      } */
    
      getViewMapLists(foldername: number): Observable<LoginModel[]> {
        let viewmapurl = this.GlobalServices.ApiUrls().viewMap;
        return this.http.get<LoginModel[]>(viewmapurl+"/"+foldername).pipe(
          tap(receivedProducts => console.log(`receivedMaps = ${JSON.stringify(receivedProducts)}`)),
          catchError(error => of([]))
        );
      }
    
      getViewimageFromId(id: number): Observable<DisplayImageModel[]>{
        //return of(productLists.find(product => product.id == id));
        let displayimageurl = this.GlobalServices.ApiUrls().displayImages+"/"+id;
        return this.http.get<DisplayImageModel[]>(displayimageurl);
      }
    
      unidentified_solarpanel(unidentifiedSolar: string) {
    
        let unidentifiedSolarurl = this.GlobalServices.ApiUrls().unidentifiedSolar;
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json;charset=UTF-8');
      
        let $request = this.http.post(unidentifiedSolarurl,unidentifiedSolar, {headers: headers})
        return $request;
      } 
      getAppList(obj){
        let url = this.GlobalServices.ApiUrls().getAppList
        return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
    userprojects(obj){
      let url = this.GlobalServices.ApiUrls().userprojects
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
    getInverterNames(obj){
      let url = this.GlobalServices.ApiUrls().getInverterNames.replace('{plant_id}', obj['id'])
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
    getInverterdropdown(obj){
      let url = this.GlobalServices.ApiUrls().getInverterdropdown
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
    getReports(obj){
      let url = this.GlobalServices.ApiUrls().getReports
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }  
    report(obj){
      let url = this.GlobalServices.ApiUrls().report;
      return this.HttpServices.httpRequest({ url, method: 'F', ...obj });
    }
    editReport(obj){
      let url = this.GlobalServices.ApiUrls().editReport;
      return this.HttpServices.httpRequest({ url, method: 'F', ...obj });
    }
    getwtgs(obj){
      let url = this.GlobalServices.ApiUrls().getwtgs.replace('{id}', obj.id)
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
    getWtgTypes(obj){
      let url = this.GlobalServices.ApiUrls().getWtgTypes
      return this.HttpServices.httpRequest({ url, method: 'G', ...obj })
    }
}