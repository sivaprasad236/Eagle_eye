import { GlobalServices } from './../../../services/global-services';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { CommonServices } from '../../../services/common-services';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs/RX';

export interface User {
  employee_id: string;
  usename: string;
  work_email: string;
}

export interface ProjectsView {
  project: string;
}

@Component({
  selector: 'app-add-user-management',
  templateUrl: './add-user-management.component.html',
  styleUrls: ['./add-user-management.component.css']
})

export class AddUserManagementComponent implements OnInit {
 
  role:string='';  
  project:string='';  
  username:string='';  
  work_email:string='';  
  employee_id:string='';
  currentUser:any = {};

  strData: any;

  userRoles: any;
  isShowRole: boolean;

  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  userLogin: string;

  constructor(private GlobalServices:GlobalServices, private CommonServices: CommonServices,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddUserManagementComponent>,
    public dialog: MatDialog, public snackBar: MatSnackBar) 
    {
      dialogRef.disableClose = true;
      this.currentUser = this.GlobalServices.getLocalItem('authentication',true);
      this.userRoles = this.GlobalServices.rolesdata;
      this.strData = data;
      if(this.strData.role == "ADMIN"){
        this.isShowRole = false;
      }else if(this.strData.role == "APEX"){
        this.isShowRole = false;
      }else{
        this.isShowRole = true;
      }


      this.userLogin = localStorage.getItem('username');
    }

    addUserMngt(){
      const obj = JSON.stringify({
        role: this.strData.role,
        project: this.strData.project,
        employee_id:this.employee_id,
        username: this.username,
        work_email: this.work_email,
        "created_by": this.userLogin
      });

      //console.log(obj);

      if(this.username != ""){

        this.CommonServices.addUserManagement(obj).subscribe(res => {
          if(res['success'] == 1){
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });
            this.dialogRef.close();
            window.location.reload();
            
          }else{
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });
            window.location.reload();
          }
        },
        err => {
          console.log(err);
        });
      }else{
        this.snackBar.open("Enter User Management", "close", {
          duration: 2000,
        });
      }

      //console.log(obj);
    }

    selectPlotOption(value){
      this.employee_id = value.selectPlotOption
      this.username = value.usename
      this.work_email = value.work_email
      //console.log(this.username, this.work_email, this.employee_id);
    }


  ngOnInit() {
    this.getUsers();

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.usename),
      map(name => name ? this._filter(name) : this.options.slice())
    );  
  }

  displayFn(user?: User): string | undefined {
    return user ? user.usename : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.usename.toLowerCase().indexOf(filterValue) === 0);
  }

  public getUsers() {
    this.CommonServices.getUserlists({}).subscribe(
      res =>  {
          
        if(res['success'] == 1){
          this.options = res['data'];
        }else{
          console.log(this.options);
        }
      } ,
      err => {
        console.log(err);
      });
  }
}
