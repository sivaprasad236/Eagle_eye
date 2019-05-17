import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { GlobalServices } from './global-services';
import _ from 'lodash';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { error } from 'selenium-webdriver';
import { HttpObserve } from "@angular/common/http/src/client";

@Injectable()

export class HttpServices {
  formData: FormData;
  constructor(private httpClient: HttpClient, private GlobalServices: GlobalServices) { }

  public httpLogin(url, header) {
    return this.httpClient.post(url, "", {
      headers: header
    })
      .map((res) => res)
      .catch((err) => {
        return new Observable(observer => {
          observer.error(err);
        });
      });

  }

  public httpRequest(request: {
    url: string,
    method: string,
    data?: any,
    headers?: {},
    params?: {},
    apiToken?:{},
    file?:any,
    frmdata?:any,
    reportProgress?: boolean,
    observe?:HttpObserve
  }) {   
    
    let params: HttpParams = new HttpParams();
    let headers: HttpHeaders = new HttpHeaders();
    if(request.params){
      _.forEach(request.params, (val, key) => {
        params = params.set(key.toString(), val);
      });
    }
    
    if(request.headers){

      _.forEach(request.headers, (val, key) => {
        headers = headers.set(key.toString(), val);
      });
     
    }
   
    let authHeaders;
    // const  authHeaders = this.GlobalServices.getAuthorization();
   
    if (request.apiToken) {
      authHeaders = {
        'Authorization': 'Token ' + request.apiToken,
      };
      _.forEach(authHeaders,(val, key) => {
        headers = headers.set(key.toString(), val);
      });
    }else{
       authHeaders = this.GlobalServices.getAuthorization();
      _.forEach(authHeaders,(val, key) => {
        headers = headers.set(key.toString(), val);
      });
    }
if(request.method == 'F'){
  const formData = request.frmdata;
  //formData.append('file', request.file, request.file.name);
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.formData = formData;
}   
    
    let service: any;
    //let options = { headers, params}
    
    let options = {}
    if(request.observe){
      options = { headers, params, observe:request.observe as 'body', reportProgress:request.reportProgress};
    }
    else{
      options = { headers, params}
    } 
   
    //const optionsfile = { headers, reportProgress: true, observe:'event' };

    if (request.method == 'P') {
      return this.httpClient.post(request.url, request.data, options).map((res) => {
        
        if(res && res['success'] == 2){
          this.GlobalServices.invalidApiToken();
        }else{
          return res;
        }
      })
        .catch((err) => {
          if(err && err['success'] == 2){
            this.GlobalServices.invalidApiToken();
          }
          return new Observable(observer => {
            //console.log(err);
            observer.error(err);
          });
        });
    }
    if (request.method == 'G') {
      return this.httpClient.get(request.url, options).map((res) => {
        if(res['success'] == 2){
          this.GlobalServices.invalidApiToken();
        }else{
          return res;
        }
      })
        .catch((err) => {
           
          if(err['success'] == 2){
            console.log(err);
             
            this.GlobalServices.invalidApiToken();
          }
          return new Observable(observer => {
            observer.error(err);
          });
        });
    }
    if (request.method == 'D') {
      return this.httpClient.delete(request.url, options).map((res) => {
        if(res['success'] == 2){
          this.GlobalServices.invalidApiToken();
        }else{
          return res;
        }
      })
        .catch((err) => {
          if(err['success'] == 2){
            this.GlobalServices.invalidApiToken();
          }
          return new Observable(observer => {
            observer.error(err);
          });
        });
    }

    if (request.method == 'F') {      
   
      return this.httpClient.post(request.url,this.formData, options).map((res) => {
        
        if(res['success'] == 2){
          this.GlobalServices.invalidApiToken();
        }else{
          return res;
        }
      })
        .catch((err) => {
          if(err['success'] == 2){
            this.GlobalServices.invalidApiToken();
          }
          return new Observable(observer => {
            observer.error(err);
          });
        });
    }
  }

}