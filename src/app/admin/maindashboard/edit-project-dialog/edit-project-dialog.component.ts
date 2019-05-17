import { CommonServices } from '../../../services/common-services';
import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar, MatDialogRef} from '@angular/material';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs/RX';
import { startWith, map } from 'rxjs/operators';

export interface ProjectName {
  project : string;
}

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.sass']
})
export class EditProjectDialogComponent implements OnInit {

  projectForm: FormGroup;
  
  @ViewChild('projectname') project_name: ElementRef;
  data: any = {}
  projectnamelist: ProjectName[] = [];
  filteredprojectnameOptions: Observable<ProjectName[]>;
  myControl = new FormControl('', Validators.required);

  selectedProjectType: string;

  model: any;
  selectedValue: string;
  edit: boolean;
  defaultValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public obj: any, private fb: FormBuilder, 
  private commonService: CommonServices, private _router:Router, public snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<EditProjectDialogComponent>) {

    dialogRef.disableClose = true;

    console.log(obj);

    

    
  }

  ngOnInit() {
    if(this.obj != undefined){
      this.data = this.obj
    }
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

  

  addProject(form:NgForm) {
    //console.log(this.projectForm.value);

    if(form.invalid){
      return false
    }
     let obj = {
       data: this.data
     }
      console.log(obj);

      this.commonService.editProject(obj).subscribe(data =>{
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

    

  }
  }