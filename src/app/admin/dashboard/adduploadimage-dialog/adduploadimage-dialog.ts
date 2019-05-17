import { MatSnackBar } from '@angular/material';
import { CommonServices } from './../../../services/common-services';
import { GlobalServices } from './../../../services/global-services';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { HttpErrorResponse, HttpEventType, HttpResponse, HttpHeaderResponse } from '@angular/common/http';

@Component({
  selector: 'app-adduploadimagedialog',
  templateUrl: './adduploadimage-dialog.html',
  styleUrls: ['./adduploadimage-dialog.sass']
})
export class AddUploadImageComponent implements OnInit {

  addFiles: string[] = [];
  filescounts: string = '';
  apiToken: any;
  public show_addfile: boolean = false;
  addfileuploading: string = '';
  addpercuploading: string = '';
  isDisabled: boolean = false;


  constructor(public snackBar: MatSnackBar,
     private commonService: CommonServices,
     public globalService: GlobalServices,
    public dialogRef: MatDialogRef<AddUploadImageComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.apiToken = this.globalService.getLocalItem('authentication', true)['data']['token'];
     } 

  ngOnInit() {
  }

  getAddFileDetails(e) {
    console.log(e);
    if (e.target.files.length > 0) {
      this.addFiles = [];
      for (var i = 0; i < e.target.files.length; i++) {
        this.addFiles.push(e.target.files[i]);
        this.filescounts = e.target.files.length + " files";
      }
    }
  }

  onSubmit(){
    if (this.addFiles.length != 0) {
      
      let frmData = new FormData();
      const date = moment(this.data.Date).format("DD-MM-YYYY");
      for (let i = 0; i < this.addFiles.length; i++) {
        if(this.data.wtg_name != undefined){
          
          frmData.append('project', this.data.Project);
          frmData.append("business_type", this.data.Type);
          frmData.append("wtg_name", this.data.wtg_name);
          frmData.append("img_type", this.data.image_type);
          frmData.append("filename", this.data.Folder_Name);
          frmData.append('file', this.addFiles[i]);
          frmData.append("blade_name", this.data.blade_name);
          frmData.append("Date", date);
        }
        else{
          
          frmData.append('project', this.data.Project);
          frmData.append("business_type", this.data.Type);
          frmData.append("plot", this.data.plot);
          frmData.append("img_type", this.data.image_type);
          frmData.append("filename", this.data.Folder_Name);
          frmData.append('file', this.addFiles[i]);
          frmData.append("Date", date);
        }
       
      }

      const data = {
        apiToken: this.apiToken,
        frmdata: frmData,
        reportProgress: true,
        observe: 'events'
      }
      
      this.commonService.addUploadFile(data).subscribe(
        (event) => {
          
          if (event['type'] === HttpEventType.UploadProgress) {
            this.isDisabled = true;
            this.show_addfile = !this.show_addfile;
            this.show_addfile = true;
            const percentDone = Math.round(100 * event['loaded'] / event['total']);
            this.addfileuploading = "Image File is " + percentDone + "% uploaded.";
            console.log(`File is ${percentDone}% uploaded.`);
            this.addpercuploading = "" + percentDone;
          }
          else if (event['body'] != undefined) {
            this.addfileuploading = "Processing....";
            this.show_addfile = false;
            this.isDisabled = true;
            if (event['body']["success"] == 1) {
              frmData.delete;
              setTimeout(() => {
                this.addfileuploading = "";
                this.show_addfile = false;
                this.isDisabled = true;
                this.snackBar.open("Images uploaded successfully", "close", {
                  duration: 2000,
                });
                this.dialogRef.close();
              }, 2000);
             
              frmData.delete;

            } else {
              this.isDisabled = false;
            }
          }
        }, err => {
          console.log(err);
          this.isDisabled = false;
        });
    } else {
      this.snackBar.open("Select Image File", "close", {
        duration: 2000,
      });
    }
  }

}
