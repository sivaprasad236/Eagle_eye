import { GlobalServices } from './../../services/global-services';
import { CommonServices } from './../../services/common-services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  data: any = {};
  onSubmitLoading: boolean;

  public loading: boolean = false;

  errorMessage: string;

  constructor(
    private GlobalServices: GlobalServices,
    private router: Router, 
    private commonServices: CommonServices,
    private route: ActivatedRoute
  ) {
      this.errorMessage = "";

      this.route.queryParams.subscribe(params => {

        if(params['code'] == undefined && params['response_type'] == undefined && params['redirect_uri'] == undefined){

        }else{
          this.loading = true;
          /* console.log("code: "+params['code']);
          console.log("response_type: "+params['response_type']);
          console.log("redirect_uri: "+params['redirect_uri']); */

          localStorage.setItem('redirect_usermngt', params['redirect_uri']);

          let data = atob(params['response_type']);
          let res = JSON.parse(data);

          if (res['success'] == '1') {
            this.loading = false;
            this.GlobalServices.setLocalItem('authentication', res, true);
            this.GlobalServices.init();
            this.router.navigate(['/maindashboard']);
  
          } else if (res['success'] == '0'){
            this.loading = false;
            console.log(res['message']);
          }
        }
      });
   }

  ngOnInit() {
    if (this.GlobalServices.hasValidIdToken()) {
      this.router.navigate(['/maindashboard']);
    }
  }

  /* public loginSubmit(event, form) {
    event.preventDefault();
    if (form.invalid) {
      return false;
    }
    this.onSubmitLoading = true;
    let formObj = form.value;
    let obj = {
      'username': formObj.userName,
      'password': formObj.password
    }
    this.GlobalServices.removeLocalItem('rememberMe');

    //console.log(obj);
    this.commonServices.userlogin(obj).subscribe(
      res => {
        if (res['success'] == '1') {
          this.GlobalServices.setLocalItem('authentication', res, true);
          this.GlobalServices.init();;
          if (formObj.remember) {
            this.GlobalServices.setLocalItem('rememberMe', formObj, true);
          }
          this.router.navigate(['/maindashboard']);

        } else if (res['success'] == '0'){
          console.log(res);
          this.errorMessage = res['message'];
        }
        this.onSubmitLoading = false;

      },
      err => {
        this.errorMessage = "Unable to connect server";
        console.log(err);
        this.onSubmitLoading = false;
      });
  } */



  /* loginSubmit(event, form){
    if (this.form.valid) {
      this.User_ID.nativeElement.disabled = true;
      this.Password.nativeElement.disabled = true;
      this.loginFormsubmittingLoader = true;
      this.commonService.login(this.form.value).subscribe((res) => {
        if(res['success'] == true){
          
          this.router.navigate(['/admin/maindashboard']);
          this.errorMessage = res['message'];
          this.loginFormsubmittingLoader = false;
          this.User_ID.nativeElement.disabled = false;
      this.Password.nativeElement.disabled = false;
        }else{
          this.errorMessage = res['message'];
          this.loginFormsubmittingLoader = false;

          this.User_ID.nativeElement.disabled = false;
          this.Password.nativeElement.disabled = false;
          this.User_ID.nativeElement.value = '';
          this.Password.nativeElement.value = '';
        }
      },
      (error) => {
        this.errorMessage = "Unable to connect server";
        this.loginFormsubmittingLoader = false;
        this.User_ID.nativeElement.disabled = false;
        this.Password.nativeElement.disabled = false;
        this.User_ID.nativeElement.value = '';
        this.Password.nativeElement.value = '';
      })
    }
    this.formSubmitAttempt = true; 

  } */  

}
