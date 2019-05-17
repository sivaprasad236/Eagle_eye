import { CommonServices } from '../../../services/common-services';
import { GlobalServices } from '../../../services/global-services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { MapComponent } from '../../map/map.component';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { UploadModel } from '../../../models/upload.model';
import { DataService } from '../../../models/data.model';
import { Router } from '@angular/router';

export interface UserData {
  Date: string;
  Project: string;
  Type: string;
  Status: string;
}

export interface Project {
  name: string;
  pvalue: string;
}

export interface Plant {
  name: string;
  plvalue: string;
}

@Component({
  selector: 'app-gis-dashboard',
  templateUrl: './gis-dashboard.component.html',
  styleUrls: ['./gis-dashboard.component.sass']
})
export class GISComponent implements OnInit {

  displayedColumns: string[] = ['date', 'project', 'type', 'plot', 'status', 'action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort ) sort: MatSort;

  private formSubmitAttempt: boolean;

  @ViewChild("plot") plot: ElementRef;


  myFiles:string [] = [];

  uploadlists: UploadModel[];

  uploadform:FormGroup;

  fileuploading: string = '';
  percuploading: string = '';

  show_processtype: boolean = false;

  filescount: string = '';

  project_name: string;
  project_type: string;

  public isDisabled:boolean = false;
  
  public hasData:boolean = false;

  public show:boolean = false;
  processtypelist = [];
  imagetypelist = [];

  selectedProcessType: string;
  selectedImageType: string;
  apiToken: any;

  project_dataitem: any;
  
  constructor(
    private fb: FormBuilder,
    private commonService: CommonServices, 
    public _dialog: MatDialog,
    public dataService : DataService,
    private _router:Router,
    public globalService: GlobalServices,
    public snackBar: MatSnackBar
    ) { 
      this.getDropdownlist();
      this.apiToken = this.globalService.getLocalItem('authentication', true)['data']['token'];
     
    } 

  ngOnInit() {

    this.project_dataitem = JSON.parse(localStorage.getItem('project_dataitem'));
    this.project_name = this.project_dataitem.projectname;
    this.project_type = this.project_dataitem.projecttype;

    this.uploadform = this.fb.group({
      file: ['']
    });

    this.initMap();
    this.uploadFilelists(this.project_name, this.project_type);
  }

  /* selectProcessType(event) {
    this.selectedProcessType  = event;
  } */

  selectImageType(event) {
    this.selectedImageType  = event;
  }

  getDropdownlist(){
   this.commonService.getDropdown({}).subscribe(data => {
      if(data["success"] == 1){
        //this.processtypelist = data["data"].processtype;
        this.imagetypelist = data["data"].image_type;
        //console.log(this.processtypelist);
        
      }else{
        
      }
    } 

  );   
  }

  getFileDetails (e) {

   if(e.target.files.length > 0){
      for (var i = 0; i < e.target.files.length; i++) { 
        this.myFiles.push(e.target.files[i]);
        this.uploadform.get('file').setValue(this.myFiles);

        this.filescount = e.target.files.length+" files";
      }
    }
    
  }

  uploadSubmit(form:NgForm){
    /* console.log(this.project_name);
    console.log(this.project_type);
    console.log(this.plot.nativeElement.value);
    console.log(this.selectedImageType);
    //console.log(this.myFiles);
    for (let i = 0; i < this.myFiles.length; i++) { 
      console.log(this.myFiles[i]);
    } */

    console.log(this.project_dataitem);
    this.isDisabled = false;
    let frmData = new FormData();
    frmData.append('project', this.project_dataitem.project_name);
    frmData.append("business_type", this.project_dataitem.project_type);
    frmData.append("plot", this.project_dataitem.plot);
    frmData.append("img_type", this.project_dataitem.selectedImageType);
    
    
    for (let i = 0; i < this.myFiles.length; i++) { 
      frmData.append('file', this.myFiles[i]);
    }
    const data = {
      apiToken: this.apiToken,
      frmdata: frmData,
      reportProgress: true, 
      observe:'events'
    }

    if(this.myFiles.length != 0){
      this.commonService.uploadImageFile(data).subscribe(
        
        data => {
           if(data['type'] === HttpEventType.UploadProgress){
              this.isDisabled = false;
              this.show = !this.show;
              this.show = true;
              const percentDone = Math.round(100 * data['loaded'] / data['total']);
              this.fileuploading = "Image File is "+percentDone+"% uploaded.";
              this.percuploading = ""+percentDone;
              
              console.log(`File is ${percentDone}% uploaded.`);
              
              if(percentDone == 100){
                setTimeout(()=>{    //<<<---    using ()=> syntax
                  this.show = false;
             }, 2000);
             
        
                //this.uploadFileProcess();
              }
            }else if(data['type'] === HttpEventType.Response){
              //console.log("type:  "+data);
              //this.isDisabled = false;
            }
            if(data['body'] != undefined){
              if(data['body']["success"] == 1){
                console.log(data)
                this.plot.nativeElement.value ="";
                this.myFiles = [];
                this.filescount = "";
                this.selectImageType('');
                setTimeout(()=>{    
                  this.isDisabled = false;
                  this.fileuploading = "";
             }, 2000);
             //this.globalService.showSuccessMessage("Record saved successfully")
                console.log(data);
                
                this.snackBar.open("Images uploaded successfully", "close", {
                  duration: 2000,
                }); 
    
               
              }else{
               
                this.isDisabled = false;
                //console.log(data['message']);
               
              }
            }
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
          this.isDisabled = false;
        }
      );
    }else{
      this.globalService.showSuccessMessage("Select Image file");
      this.isDisabled = false;
    }

    //console.log(JSON.stringify(frmData.get('project')));
  }






  /* uploadSubmit(){

    let frmData = new FormData();
    frmData.append('project', this.project_name);
    frmData.append("business_type", this.project_type);
    frmData.append("plot", this.plot.nativeElement.value);
    frmData.append("img_type", this.selectedImageType);
    
    
    for (let i = 0; i < this.myFiles.length; i++) { 
      frmData.append('file', this.myFiles[i]);
    }
    const data = {
      apiToken: this.apiToken,
      frmdata: frmData,
        reportProgress: true, 
        observe:'events'
     
    }

    if(this.myFiles.length != 0){
      this.commonService.uploadImageFile(data).subscribe(
        data => {

          if(data['type'] === HttpEventType.UploadProgress){
            this.isDisabled = true;
            this.show = !this.show;
            this.show = true;
            const percentDone = Math.round(100 * data['loaded'] / data['total']);
            this.fileuploading = "Image File is "+percentDone+"% uploaded.";
            this.percuploading = ""+percentDone;
            
            console.log(`File is ${percentDone}% uploaded.`);
            
            if(percentDone == 100){
                setTimeout(()=>{   

                  this.show = false;

                  
             }, 2000);
            }else if(data['type']  === HttpEventType.Response){
              //console.log("type:  "+data);
              this.isDisabled = false;
          }
          
          if(data["success"] == 1){
            this.isDisabled = true;

            this.snackBar.open("Image Successfully", "close", {
              duration: 2000,
            });
            this.fileuploading = "Image Successfully";
            this.uploadFilelists(this.project_name, this.project_type);
            
          }else{
            this.isDisabled = false;
             this.snackBar.open(data['message'], "close", {
              duration: 2000,
            }); 
            
            //this.uploadFileProcess();
          }
        }
        
          
           
          
        },
        err => {
          this.isDisabled = false;
          console.log(err);
        });
    }else{
      this.globalService.showSuccessMessage("Select Image file");
      this.isDisabled = false;
    }

    //console.log(JSON.stringify(frmData.get('project')));
  } */

  /* uploadSubmit(){

      const frmData = new FormData();
      frmData.append('project', this.project_name);
      frmData.append("business_type", this.project_type);
      frmData.append("plot", this.plot.nativeElement.value);
      frmData.append("img_type", this.selectedImageType);
      
      for (let i = 0; i < this.myFiles.length; i++) { 
        frmData.append('file', this.myFiles[i]);
      }

      //console.log(frmData);

      if(this.myFiles.length != 0){
        this.commonService.uploadImageFile({file: frmData}).subscribe(
          data => {
          
            if(data["success"] == 1){
              this.isDisabled = true;

              console.log(data);
            
  
               if(data.type === HttpEventType.UploadProgress){
                this.isDisabled = true;
                this.show = !this.show;
                this.show = true;
                const percentDone = Math.round(100 * data.loaded / data.total);
                this.fileuploading = "Image File is "+percentDone+"% uploaded.";
                this.percuploading = ""+percentDone;
                
                //console.log(`File is ${percentDone}% uploaded.`);
                
                if(percentDone == 100){
                  
                  //this.uploadFileProcess();
                }
              }else if(data.type === HttpEventType.Response){
                //console.log("type:  "+data);
                this.isDisabled = false;
              }  
            }else{
              //window.alert(data['message']);
              this.isDisabled = false;
              console.log(data['message']);
             
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err.message);
            this.isDisabled = false;
          }
        );
      }else{
        this.globalService.showSuccessMessage("Select Image file");
        this.isDisabled = false;
      }
  } */

  uploadFileProcess(){
    this.fileuploading = "Processing... Please wait!";
    this.commonService.uploadFileProcess().subscribe(
      (res: Response) => {
        if(res["success"]=1){
          this.globalService.showSuccessMessage(res['message']);
          this.fileuploading = "";
          //this.uploadFilelists(this.project_name, this.project_type);
          this.show = false;
          this.uploadform.reset();
          this.myFiles = [];
          this.filescount = "";
          this.isDisabled = false;
          
        }else{
          this.globalService.showSuccessMessage(res['message']);
          this.fileuploading = "";
          //this.uploadFilelists(this.project_name, this.project_type);
          this.show = false;
          this.uploadform.reset();
          this.myFiles = [];
          this.filescount = "";
          this.isDisabled = false;
        }
      }
    );
  }

  uploadFilelists(project_name, project_type){

    let datavalue = {
      "project_name": project_name,
      "project_type": project_type
    };

    //console.log(datavalue);

   this.commonService.getDataRetrieval(datavalue).subscribe(data => {
      if(data["success"] == 1){

        this.hasData = !this.hasData;
        this.hasData = true;

        this.uploadlists = data["data"];

        this.dataSource = new MatTableDataSource(data["data"]);
        this.ngAfterViewInit();
        
      }else{
        this.hasData = false;
      }
    } 

  );   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.pager = this.uploadlists.length
    //this.dataSource.paginator.length;
  }

  initMap(){}


  onSenddata(uploadlist: UploadModel) {

    const foldername = uploadlist.Folder_Name;

    //{"Date":"2019-01-30","Project":"project1","Type":"solar","Status":"Completed","Time_Stamp":"2019-01-30T06:09:33.168Z","Folder_Name":"20190130060933","plot":"lll","image_type":"RGB"}

    /* let details = {
      "Project": uploadlist.Project,
      "Type": uploadlist.Type,
      "Folder_Name": uploadlist.Folder_Name,
      "plot": uploadlist.plot,
      "image_type": uploadlist.image_type,
    } */



    console.log("uploadlist: "+JSON.stringify(uploadlist));
    localStorage.setItem('viewimage_details', JSON.stringify(uploadlist));
    this._router.navigate(['/viewimage']);


    //localStorage.setItem('viewimage_details', uploadlist);
    //this._router.navigate(['/viewimage']);

    /* this.dataService.dataFromService = uploadlist.Folder_Name;
    this._router.navigate(['/admin/un-identified']); */

  }

  viewMap(uploadlist: UploadModel) {
    const dialogRef = this._dialog.open(MapComponent, {
      data: uploadlist.Folder_Name,
      height: '90%',      
      panelClass: 'map-dialog',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }  
}
