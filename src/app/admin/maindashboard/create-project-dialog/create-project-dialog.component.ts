import { CommonServices } from './../../../services/common-services';
import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar, MatDialogRef} from '@angular/material';

import { FormBuilder, FormGroup, Validators ,FormsModule,NgForm, FormControl } from '@angular/forms'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { startWith, map } from 'rxjs/operators';

export interface ProjectName {
  project : string;
}

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.sass']
})
export class CreateProjectDialogComponent implements OnInit {

  projectForm: FormGroup;  
  /* projectname:string='';  
  Projecttype:string='';  
  description:string='';  */
  
  @ViewChild('projectname') projectname: ElementRef;

  projecttypelist: string[] = [];

  projectnamelist: ProjectName[] = [];
  filteredprojectnameOptions: Observable<ProjectName[]>;
  myControl = new FormControl('', Validators.required);

  selectedProjectType: string;

  model: any;
  selectedValue: string;
  edit: boolean;
  defaultValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, 
  private commonService: CommonServices, private _router:Router, public snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<CreateProjectDialogComponent>) {

    dialogRef.disableClose = true;

    console.log(data);

    this.projectForm = fb.group({  
      'projectname' : this.myControl,  
      'Projecttype' : new FormControl('', Validators.required),  
      'description' : new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),  
    });

    
  }

  ngOnInit() {
    this.getProjectTypeList();
    
    this.filteredprojectnameOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ProjectName>(''),
        map(value => typeof value === 'string' ? value : value.project),
        map(name => name ? this._filter(name) : this.projectnamelist.slice())
      );
  }

  displayFn(user?: ProjectName): string | undefined {
    return user ? user.project : undefined;
  }

  private _filter(name: string): ProjectName[] {
    const filterValue = name.toLowerCase();

    return this.projectnamelist.filter(option => option.project.toLowerCase().indexOf(filterValue) === 0);
  }

  selectProjectType(event) {
    //this.myControl.res;
    
    //this.projectname.nativeElement.value = '';
    
    this.selectedProjectType  = event;
    
    let obj = {
      "project_type":this.selectedProjectType
    }
    
    this.commonService.getDashboardProjectsList(obj).subscribe(res => {
      if(res['success'] == 1){
        this.projectnamelist = res["data"];

        //console.log(JSON.stringify(this.projectnamelist));
        
      }else{
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
      }
    },
    err => {
      console.log(err);
    }); 
    
  }

  getProjectTypeList(){

    this.commonService.getProjectType({}).subscribe(res => {
      if(res['success'] == 1){
        

        this.projecttypelist = res["data"];
        
      }else{
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
      }
    },
    err => {
      console.log(err);
    });
  }

  addProject(label1, label2, label3) {
    //console.log(this.projectForm.value);

    if(label1 != "" && label2 != "" && label3 != ""){
      const obj = {
        projectname: label1,
        projecttype: label2,
        description: label3
      };
  
      //console.log(obj);

      this.commonService.createProject(obj).subscribe(data =>{
        if(data["success"] == 1){
           //this._router.navigate(['/maindashboard']);
          
          this.dialogRef.close();
          
          this.snackBar.open(data["message"], "close", {
            duration: 2000,
          });
          //window.location.reload();
         
        }else{
          this.snackBar.open(data["message"], "close", {
            duration: 2000,
          });
        }
      }, err => {
          console.log(err);
        }); 

    }else{
      this.snackBar.open("All the fields are mandatory", "close", {
        duration: 2000,
      });
    }

    

    /* 

    this.commonService.createProject(obj).subscribe(data =>{
      if(data["success"] == 1){
         this._router.navigate(['/maindashboard']);
        
        this.dialogRef.close();
        
        this.snackBar.open(data["message"], "close", {
          duration: 2000,
        });
        window.location.reload();
       
      }else{
        this.snackBar.open(data["message"], "close", {
          duration: 2000,
        });
      }
    }, err => {
        console.log(err);
      }); 
    } */
  }
}




  // Executed When Form Is Submitted  
  /* onFormSubmit(form:NgForm)  
  {  
    let resource = JSON.stringify(form);
    console.log(resource);

    var datavalue = form.value;

    this.commonService.createProject(datavalue).subscribe(data =>{
      if(data["success"]=1){
        console.log(data["message"]);
        alert(data["message"]);
      }else{
        console.log(data["message"]);
        alert(data["message"]);
      }},
        (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      );
  }  */ 

 

