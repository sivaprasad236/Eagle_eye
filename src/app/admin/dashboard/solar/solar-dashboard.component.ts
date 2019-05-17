import { CommonServices } from './../../../services/common-services';
import { GlobalServices } from './../../../services/global-services';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator, MatSnackBar, MatDialogRef } from '@angular/material';
import { MapComponent } from '../../map/map.component';
import { FormGroup, FormBuilder, NgForm, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpEventType, HttpResponse, HttpHeaderResponse } from '@angular/common/http';
import { UploadModel } from '../../../models/upload.model';
import { DataService } from '../../../models/data.model';
import { Router } from '@angular/router';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AddUploadImageComponent } from '../adduploadimage-dialog/adduploadimage-dialog';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { PotreeComponent } from '../../potree/potree.component';


export interface UserData {
  Date: string;
  Folder_Name: string;
  Project: string;
  Status: string;
  Type: string;
  image_type: string;
  plot: string;
}

export interface Project {
  name: string;
  pvalue: string;
}

export interface Plant {
  name: string;
  plvalue: string;
}

export interface Plotname {
  inv_name: string;
  object_id: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './solar-dashboard.component.html',
  styleUrls: ['./solar-dashboard.component.sass']
})
export class SolarComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['select', 'date', 'plot', 'totalImages', 'imagetype', 'issues', 'status', 'action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private formSubmitAttempt: boolean;

  @ViewChild("plot") plot: ElementRef;

  dialogRef: MatDialogRef<ConfirmdialogComponent>;

  @ViewChild('form') form;
  myFiles: string[] = [];
  addFiles: string[] = [];
  myFilesname: string[] = [];
  chunk: any = [];

  uploadlists: UploadModel[];

  uploadform: FormGroup;
  dataLoading: boolean;
  fileuploading: string = '';
  percuploading: string = '';

  addfileuploading: string = '';
  percadduploading: string = '';
  public add_show: boolean;

  filescount: string = '';
  addfilescount: string = '';

  project_name: string;
  project_type: string;

  project_dataitem: any = {};

  public isDisabled: boolean = false;
  public isProcessDisabled: boolean = true;

  public isEnableCheckbox: boolean;

  public hasData: boolean;

  public show: boolean = false;
  processtypelist = [];
  imagetypelist = [];
   myControl = new FormControl();
  selectedProcessType: string;
  selectedImageType: string;
  apiToken: any;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  @ViewChild('myPlotInput')
  myPlotInputVariable: ElementRef;

  selectedRowIndex: any;

  myPlotControl = new FormControl();
  options: Plotname[] = [];
  filteredOptions: Observable<Plotname[]>;
  myFiles1: any = [];
  chunkNos: any[];
  tree_name: string;
  invts: any =[];
  data: any ={};
  pageSizeOptions: number[];
  pageSize: number;
  totalRecords: any;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonServices,
    public _dialog: MatDialog,
    public dataService: DataService,
    private _router: Router,
    public globalService: GlobalServices,
    public snackBar: MatSnackBar,
  ) {
    this.getDropdownlist();
    this.myFiles1 = this.chunks(this.myFiles1, 20);
    this.apiToken = this.globalService.getLocalItem('authentication', true)['data']['token'];
    this.project_dataitem = JSON.parse(localStorage.getItem('project_dataitem'));
    this.project_name = this.project_dataitem.projectname;
    this.project_type = this.project_dataitem.projecttype;
    this.tree_name = localStorage.getItem('tree_name');
    let stringToSplit = this.tree_name;
    this.getInverterNames()
  }

  ngOnInit() {
    this.pageSizeOptions = this.globalService.pageSizeOptions;
    this.pageSize = this.globalService.pageSize
    this.initMap();
    this.uploadFilelists('');
    this.inverterLists(this.project_name, this.project_type);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.inv_name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.selectedProcessType = this.myControl.value;

  }
  ngOnDestroy() {
  }
  chunks(array, size) {
    let results = [];
    results = [];
    setTimeout(() => {
      while (array.length) {
        results.push(array.splice(0, size));
      }
    }, 2000);
    return results;
  };

  displayFn(user?: Plotname): string | undefined {
    return user ? user.inv_name : undefined;
  }

  private _filter(name: string): Plotname[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.inv_name.toLowerCase().indexOf(filterValue) === 0);
  }


  selection = new SelectionModel<UserData>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if (row.Status == "Uploaded") {
          this.selection.select(row);
        }
      });
  }

  selectPlotOption(event) {
    this.selectedProcessType = event.name;
  }

  selectImageType(event) {
    this.selectedImageType = event;
  }

  getDropdownlist() {
    this.commonService.getDropdown({}).subscribe(data => {
      if (data["success"] == 1) {

        this.imagetypelist = data["data"].image_type;

      }
    }, err => {
    });
  }

  getFileDetails(e) {

    if (e.target.files.length > 0) {
      this.myFiles = [];
      for (var i = 0; i < e.target.files.length; i++) {
        this.myFiles.push(e.target.files[i]);
        //this.uploadform.get('file').setValue(this.myFiles);
        this.filescount = e.target.files.length + " files";
      }
      this.myInputVariable.nativeElement.value = ''
      this.myFiles1 = this.myFiles
    }
  }

  onAdddata(data: UploadModel) {
    const dialogRef = this._dialog.open(AddUploadImageComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.uploadFilelists('');
    });
  }
delay() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

async delayedLog(data, chunk_no, chunk_size) {
  this.chunkNos = []
  let frmData = new FormData();
  for (let j = 0; data.length > 0; j++) {
  if (j == data.length) {
    break
  }
  else {
    this.myFiles1.push(data[j])
    frmData.append('project', this.project_name);
    frmData.append("business_type", this.project_type);
    frmData.append("plot", this.project_dataitem.plot);
    frmData.append("img_type", this.project_dataitem.image_type);
    frmData.append('file', data[j]);
    frmData.append('chunk_no', chunk_no || "");
    frmData.append('chunk_size', chunk_size || "");
  }

}
let obj = {}
obj = {
  apiToken: this.apiToken,
  frmdata: frmData,
  reportProgress: true,
  observe: 'events'
}

this.commonService.uploadImageFile(obj).subscribe(

  (data) => {
    if (data['type'] === HttpEventType.UploadProgress) {

      this.isDisabled = true;
      this.show = !this.show;
      this.show = true;
      const percentDone = Math.round(100 * data['loaded'] / data['total']);
      this.fileuploading = "Image File is " + percentDone + "% uploaded.";
      this.percuploading = "" + percentDone;
      obj = {}
    }
    else if (data['body'] != undefined) {
      this.fileuploading = "Processing....";
      this.show = false;
      this.isDisabled = true;
      if (data['body']["success"] == 1) {
        //frmData.delete;
        this.chunkNos.push(data['last_chunk_no'])
        this.selectedProcessType = undefined;
        this.project_dataitem.selectedImageType = "";
        this.reset();
        setTimeout(() => {
          this.isDisabled = false;
          this.fileuploading = "";
          this.show = false;
          //form.resetForm();
          this.uploadFilelists('');

          this.snackBar.open(data['data'] + data['last_chunk-no'], "close", {
            duration: 2000,
          });
        }, 2000);
        this.uploadFilelists('');
        //frmData.delete;

      } else {
        this.isDisabled = false;
        this.reset();
      }
    }
  }, err => {
    
    this.reset();
  });
obj = {}
}

async uploadSubmit(form: NgForm) {
    if ((this.project_dataitem.plot != "") &&  (this.myFiles.length != 0) && ((this.project_dataitem.image_type != undefined) || (this.project_dataitem.image_type != null))) {
      if (this.myFiles.length != 0) {
        this.isDisabled = true;
        let frmData = new FormData();

        let a = this.myFiles;
        let size = 20;
        if (this.myFiles.length >= 20) {
          let newArray = new Array(Math.ceil(this.myFiles.length / size)).fill("")
            .map(function () { return this.splice(0, size) }, this.myFiles.slice());
            let obj2;
          obj2 = Math.ceil(this.myFiles.length / size)
            for (let i = 0; newArray.length > 0; i++) {
              let data = [];
              this.myFiles1 = [];
              let chunk;
              let frmData = new FormData();
              if (i == obj2) {
                break
              }
              else {
                data = newArray[i]
                chunk = i+1 
               this.delayedLog(data, chunk, obj2);
              }
            }
        
         
        }
        else {
          let frmData = new FormData();
          for (let i = 0; i < this.myFiles.length; i++) {
            frmData.append('project', this.project_name);
            frmData.append("business_type", this.project_type);
            frmData.append("plot", this.project_dataitem.plot);
            frmData.append("img_type", this.project_dataitem.image_type);
            frmData.append('file', this.myFiles[i]);
          }

          const data = {
            apiToken: this.apiToken,
            frmdata: frmData,
            reportProgress: true,
            observe: 'events'
          }
          this.commonService.uploadImageFile(data).subscribe(
            (data) => {
             
              if (data['type'] === HttpEventType.UploadProgress) {

                this.isDisabled = true;
                this.show = !this.show;
                this.show = true;
                const percentDone = Math.round(100 * data['loaded'] / data['total']);
                this.fileuploading = "Image File is " + percentDone + "% uploaded.";
                this.percuploading = "" + percentDone;
              }
              else if (data['body'] != undefined) {
               
                if (data['body']["success"] == 1) {
                  this.fileuploading = "Processing....";
                  this.show = false;
                  this.isDisabled = true;
                  frmData.delete;
                  this.selectedProcessType = undefined;
                  this.project_dataitem.selectedImageType = "";

                  this.reset();
                  setTimeout(() => {
                    this.isDisabled = false;
                    this.fileuploading = "";
                    this.show = false;
                    form.resetForm();
                    this.uploadFilelists('');

                    this.snackBar.open("Images uploaded successfully", "close", {
                      duration: 2000,
                    });
                  }, 2000);
                  this.uploadFilelists('');
                  frmData.delete;

                } else {
                  this.show = false;
                  this.isDisabled = false;
                  this.fileuploading = "";
                  console.log(data)
                  this.globalService.showSuccessMessage(data['data'])
                  this.reset();
                }
              }
            }, err => {
              this.reset();
            });
        }
      } else {
        this.snackBar.open("Select Image File", "close", {
          duration: 2000,
        });
      }
    } else {
      this.snackBar.open("All the fields are mandatory", "close", {
        duration: 2000,
      });
      this.isDisabled = false;
    }
  }
  

//Files Upload end


  reset() {
    // this.myInputVariable.nativeElement.value = "";
    // this.myPlotInputVariable.nativeElement.value = ""
    this.myFiles = [];

    this.filescount = "";
    this.selectImageType('');
    this.selectPlotOption('');
  }

  getInverterNames(){
    let obj = {
      id:this.project_name
    }
    this.commonService.getInverterNames(obj).subscribe((res)=>{
      if(res["success"] == 1){
      this.options = res['data']['equipments']
      }
    })
  }
  selectOption(ev,option){
 
    this.invts =[]
    if (ev.source.selected) {
      this.uploadFilelists(option);
       let obj = {
      params:{
        equip_id:option.object_id
      }
    }
    this.commonService.getInverterdropdown(obj).subscribe((res)=>{
      if(res["success"] == 1){
      this.invts = res['data']['equipments']
      
      }
    })
  }
  }

  selectionProcess() {
    const data = JSON.stringify(this.selection.selected);
    if (data == "[]") {
      this.snackBar.open("Please select any process list", "close", {
        duration: 2000,
      });
    } else {
      this.commonService.setSolarProcess(data).subscribe(data => {
        if (data["success"] == 1) {
          this.snackBar.open("Process Successfully", "close", {
            duration: 2000,
          });
          this.masterToggle()
          this.uploadFilelists('');
        } else {

        }
      }, err => {
       
      }

      );
    }
  }

  public isSortingDisabled(columnText: string): boolean {
    if (columnText == "Uploaded") {
      return false;
    } else {
      return true;
    }
  }

  inverterLists(project_name, project_type) {

    let datavalue = {
      "plantname": project_name,
      "businesstype": project_type
    };

    this.commonService.getInverterslist(datavalue).subscribe(data => {
      if (data["success"] == 1) {
        let options1 = data['data'];
      } else {
        
      }
    }, err => {
      
    });
  }


  uploadFilelists(obj) {
    let size;
    let offset;
    if(obj.pageSize != undefined){
      size = obj.pageSize;
      offset = obj.pageIndex + 1;
    }
    else{
      size = 10;
      offset =1;
    }
    let datavalue ={}
    this.dataLoading = true;
    if(obj != ""){
      datavalue = {
        "project_name": this.project_name,
        "project_type": this.project_type,
        "inverter_name": obj.inv_name || "",
        "inverter": obj.plot || "",
        "image_type":"",
        "size": size,
        "offset": offset
      };
    }
    else{
      datavalue = {
        "project_name": this.project_name,
        "project_type": this.project_type,
        "inverter_name": obj.inv_name || "",
        "inverter":  "",
        "image_type":"",
        "size": size,
        "offset": offset
      };
    }
 
    this.commonService.getDataRetrieval(datavalue).subscribe(data => {
      if (data["success"] == 1) {
        this.uploadlists = data["data"];
        this.totalRecords = data["total_records"]
        this.dataLoading = false;
        if(this.uploadlists.length != 0){
          this.hasData = false;
        }
        else{
          this.hasData = true;
          this.dataLoading = false;
        }
       
        this.dataSource = new MatTableDataSource(data["data"]);
        if(this.totalRecords < 10){
          this.paginator.pageIndex = 0;
        } 
        this.ngAfterViewInit();

      } else {
        this.hasData = false;
        this.dataLoading = false;
      }
    }

    ),(err)=>{
      this.dataLoading = false;
    };
  }

  ngAfterViewInit() {
    // setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  initMap() { }

  onUnidentifiedSenddata(uploadlist: UploadModel) {
    localStorage.setItem('unidentified_details', JSON.stringify(uploadlist));
    this._router.navigate(['/un-identified']);
  }

  onSenddata(uploadlist: UploadModel) {
    console.log(uploadlist)
    localStorage.setItem('viewimage_details', JSON.stringify(uploadlist));
    // if(uploadlist.image_type == "Video"){
    //   //this._router.navigate(['/video']);
    //   const dialogRef = this._dialog.open(PotreeComponent, {
    //     width: '500px',
    //     disableClose: false,
    //     autoFocus: true,
    //     data: uploadlist
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.uploadFilelists("");
    //   });
    // }
    if(uploadlist.image_type == "Video"){
      this._router.navigate(['/video']);
    }
   
    else{
      this._router.navigate(['/viewimage']);
    }
    
  }

  viewMap(uploadlist: UploadModel) {
    const dialogRef = this._dialog.open(MapComponent, {
      data: uploadlist,
      height: '90%',
      panelClass: 'map-dialog',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
