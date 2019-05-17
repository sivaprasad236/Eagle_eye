import { CommonServices } from './../../services/common-services';
import { GlobalServices } from './../../services/global-services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { AddUserManagementComponent } from './add-user-management/add-user-management.component';

export interface UserData {
  WORK_EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMPLOYEE_ID: string
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.sass']
})
export class UserManagementComponent implements OnInit {

  username: string;

  currentUser: any = {};
  userRoles: any = [];

  viewProjectList: boolean = false;
  createdialog: boolean = false;
  viewUserList: boolean;

  selectedValue: string;
  rolesdata: string;
  projectdata: string;

  selectedRole: string = '';
  selectedProject: string = '';

  show_addProject: boolean;

  displayedColumns: string[] = ['Name', 'EmailID', 'Action'];
  dataSource: MatTableDataSource<UserData>;

  uploadlists: UserData[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort ) sort: MatSort;
  datavalue: any;
  msg: any;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 

  roleControl = new FormControl('', [Validators.required]);
  projectControl = new FormControl('', [Validators.required]);

  dialogRef: MatDialogRef<ConfirmdialogComponent>;

  constructor(private GlobalServices:GlobalServices, public snackBar: MatSnackBar, private CommonServices: CommonServices, private _router:Router, public dialog: MatDialog, private _http : HttpClient) { }

  ngOnInit() {
    this.currentUser = this.GlobalServices.getLocalItem('authentication',true)['data'];
    this.userRoles = this.GlobalServices.rolesdata;

    this.getRoles();
    this.getProjects();
    this.userMngtlists({data:{
      "role": '',
      "project": ''
    }});
  }

  
  openDialog(): void {

    if(this.selectedRole == "ADMIN" || this.selectedRole == "APEX"){
      //console.log(this.selectedRole+", "+this.selectedProject);
      this.dialogUserMngt();
    }
    else if(this.selectedProject == ""){
      //console.log(this.selectedRole+", "+this.selectedProject);
      this.snackBar.open("Select Project", "close", {
        duration: 2000,
      });
    }else if(this.selectedProject === undefined){
      //console.log(this.selectedRole+", "+this.selectedProject);
      this.snackBar.open("Select Project", "close", {
        duration: 2000,
      });
    }else{
      this.dialogUserMngt();
    }

  }
  
  dialogUserMngt(){
    const dialogRef = this.dialog.open(AddUserManagementComponent, {
      width: '450px',
      panelClass: 'my-class',
      data:  { 
        role: this.selectedRole, 
        project: this.selectedProject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      this.userMngtlists({data:{
        "role": this.selectedRole || '',
        "project": this.selectedProject || ''
      }});
    });
  }

  doSomething(event){
    this.selectedRole = event.value;

    let datavalue = {
      "role": this.selectedRole
    };
    this.userMngtlists(JSON.stringify(datavalue));

    if(this.selectedRole == null){
      this.viewProjectList = false;
      this.viewUserList = false;
      this.createdialog = false;
    }else if(this.selectedRole == "ADMIN"){
      this.viewProjectList = false;
      this.viewUserList = true;
      this.createdialog = true;
    }else if(this.selectedRole == "APEX"){
      this.viewProjectList = false;
      this.viewUserList = true;
      this.createdialog = true;
    }else{
      this.viewProjectList = true;
      this.viewUserList = true;
    } 
  }

  doSomething1(event){
    this.selectedProject = event.value;


    let datavalue = {
      "role": this.selectedRole,
      "project": this.selectedProject
    };
    this.userMngtlists(JSON.stringify(datavalue));

    if(this.selectedProject == null){

      this.createdialog = true;
      this.viewUserList = true;
    }else{
      this.createdialog = true;
      this.viewUserList = true;
    }
  }


  public getRoles() {
    this.CommonServices.getRoleslist({}).subscribe(
      res => {
        if(res['success'] == 1){
          this.rolesdata = res['data'];
        }else{
          console.log(this.rolesdata);
        }
      },
      err => {
        console.log(err);
      });
  }

  public getProjects() {
    this.CommonServices.getaddProjectslist({}).subscribe(
      res => {
        if(res['success'] == 1){
          this.projectdata = res['data'];
          console.log(this.projectdata);
        }else{
          console.log(this.projectdata);
        }
      },
      err => {
        console.log(err);
      });
  }

  userMngtlists(datavalue){
  this.datavalue = datavalue;
    //console.log("datavvvv: "+datavalue);

    this.CommonServices.getRolesUserlist(datavalue)
    .subscribe(res => {
      if(res['success'] == 1){

        this.uploadlists = res['data'];
       

        this.dataSource = new MatTableDataSource(res['data']);
        //console.log(this.dataSource);
        //this.ngAfterViewInit();
      }else{
        //this.dataSource = new MatTableDataSource(res['data']);
        console.log(res["message"]);
      }
    },
    err => {
      console.log(err);
    });
  }

  deleteUser(role){
  
     this.dialogRef = this.dialog.open(ConfirmdialogComponent, {
      disableClose: false
    });
    
    this.dialogRef.componentInstance.confirmMessage = 
    "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "*Note: If you delete the user role and project assigned to the user will be deleted."
;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        
        let obj = {
          work_email:role.WORK_EMAIL || '',
          role: this.selectedRole || '',
          project: this.selectedProject || ''
         };
    
         //console.log(obj);
         
        this.CommonServices.deleteUserManagement(obj).subscribe(
          res=>{
            if(res['success'] == 1){
             this.snackBar.open(res["message"], "close", {
               duration: 2000,
             });
             if(this.datavalue != undefined){
              this.userMngtlists(this.datavalue);
             }
             
             //window.location.reload();
           } else{
             this.snackBar.open(res["message"], "close", {
               duration: 2000,
             });
             //window.location.reload();
           }
              
          },err=>{
           console.log(err);
        });
        
      }
      this.dialogRef = null;
    });

  }


  public userLogout(){
    this.GlobalServices.removeLocalItem('authentication')
    this.GlobalServices.authenticationFailed();
  }

}
