import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatSnackBar } from '@angular/material';
import { MapComponent } from '../../map/map.component';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { UploadModel } from '../../../models/upload.model';
import { Observable } from 'rxjs';
import { CommonServices } from '../../../services/common-services';
import { AddUploadImageComponent } from '../adduploadimage-dialog/adduploadimage-dialog';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalServices } from '../../../services/global-services';
import { PotreeComponent } from '../../potree/potree.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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
  name: string;
}
export interface UserData {
  Date: string;
  Folder_Name: string;
  Project: string;
  Status: string;
  Type: string;
  image_type: string;
  plot: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
];


@Component({
  selector: 'app-wind',
  templateUrl: './wind.component.html',
  styleUrls: ['./wind.component.sass']
})
export class WindComponent implements OnInit {
  data: any = {}
  project_name: string;
  project_type: string;
  tree_name: string;
  type: string;
  wtgs: any = [];
  wtgTypes: any = [];
  bldeTypes: any = []
  displayedColumns: string[] = ['select', 'date', 'wtg_name', 'blade_name', 'image_count', 'imagetype', 'status', 'action'];
  //dataSource = ELEMENT_DATA;
  selectedProcessType: any;
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

  uploadlists: UploadModel[];
  imagetypelist: any = [];

  uploadform: FormGroup;

  fileuploading: string = '';
  percuploading: string = '';

  addfileuploading: string = '';
  percadduploading: string = '';
  public add_show: boolean;

  filescount: string = '';
  addfilescount: string = '';

  project_dataitem: any = {};

  public isDisabled: boolean = false;
  public isProcessDisabled: boolean = true;

  public isEnableCheckbox: boolean;

  public hasData: boolean = false;

  public show: boolean = false;
  processtypelist = [];


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
  wtg_name: string;
  myFiles1: any[];
  chunkNos: any;
  dataLoading: boolean;
  pageSizeOptions: number[];
  pageSize: number;
  totalRecords: any;


  constructor(
    private commonService: CommonServices,
    public _dialog: MatDialog,
    private _router: Router,
    public globalService: GlobalServices,
    public snackBar: MatSnackBar) {
    this.apiToken = this.globalService.getLocalItem('authentication', true)['data']['token'];
    
    this.bldeTypes = [
            { value: 'Blade-A', name: 'Blade-A' },
            { value: 'Blade-B', name: 'Blade-B' },
            { value: 'Blade-C', name: 'Blade-C' }
          ]
  }

  ngOnInit() {
    this.pageSizeOptions = this.globalService.pageSizeOptions;
    this.pageSize = this.globalService.pageSize
    this.project_name = localStorage.getItem('project_name');
    this.project_type = localStorage.getItem('project_type');
    this.wtg_name = localStorage.getItem('tree_name');
    this.type = localStorage.getItem('type');
    this.data = {
      project_name: this.project_name,
      project_type: this.project_type,
      wtg_name: this.wtg_name,

    }
    this.uploadFilelists(this.wtg_name)
    this.getwtgs();
    this.getDropdownlist();
    
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
    return user ? user.name : undefined;
  }

  private _filter(name: string): Plotname[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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
      //console.log(err);
    });
  }

  getFileDetails(e) {

    if (e.target.files.length > 0) {
      this.myFiles = [];
      for (var i = 0; i < e.target.files.length; i++) {
        this.myFiles.push(e.target.files[i]);
        // this.uploadform.get('file').setValue(this.myFiles);
        this.filescount = e.target.files.length + " files";
      }
      //this.myInputVariable.nativeElement.value = ''
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
      this.uploadFilelists("");
    });
  }


  delay() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  async delayedLog(project, data, chunk_no, chunk_size) {
    console.log(project)
    this.chunkNos = []
    let frmData = new FormData();
    if(project.wtg_name.wtg_name != undefined){
      for (let j = 0; data.length > 0; j++) {
        if (j == data.length) {
          break
        }
        else {
          this.myFiles1.push(data[j])
          let wtg_name = project.wtg_name.wtg_name + ":" + "Blades"
          frmData.append('project', this.data.project_name);
          frmData.append("business_type", this.data.project_type);
          frmData.append("blade_name", project.blade_name);
          frmData.append("wtg_name", wtg_name);
          frmData.append("img_type", project.image_type);
          frmData.append('file', data[j]);
          frmData.append('chunk_no', chunk_no);
          frmData.append('chunk_size', chunk_size);
        }
  
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
            this.chunkNos.push(data['last_chunk_no'])
            this.selectedProcessType = undefined;
            this.project_dataitem.selectedImageType = "";
            setTimeout(() => {
              this.isDisabled = false;
              this.fileuploading = "";
              this.show = false;
              //form.resetForm();
              this.uploadFilelists("");

              this.snackBar.open(data['last_chunk-no'], "close", {
                duration: 2000,
              });
            }, 2000);
            this.uploadFilelists("");
            //frmData.delete;

          } else {
            this.isDisabled = false;
            this.reset();
          }
        }
      }, err => {
        //console.log(err);
        this.reset();
      });
    obj = {}
  }
  async submit(form: NgForm) {
    if ((this.data.wtg_name.wtg_name != "") &&  (this.project_dataitem.wtg_name != undefined) && (this.myFiles.length != 0) && ((this.project_dataitem.image_type != undefined) || (this.project_dataitem.image_type != null))) {
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
              chunk = i + 1

              this.delayedLog(this.project_dataitem,data, chunk, obj2);
            }
          }

        }
        else {
          let frmData = new FormData();
          let wtg_name = this.project_dataitem.wtg_name.wtg_name + ":" + "Blades"
          for (let i = 0; i < this.myFiles.length; i++) {
            frmData.append('project', this.data.project_name);
            frmData.append("business_type", this.data.project_type);
            frmData.append("blade_name", this.project_dataitem.blade_name);
            frmData.append("wtg_name", wtg_name);
            frmData.append("img_type", this.project_dataitem.image_type);
            frmData.append('file', this.myFiles[i]);

            frmData.append('chunk_no', '1');
            frmData.append('chunk_size', "1");
            //frmData.append('chunk', );
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
                this.fileuploading = "Processing....";
                this.show = false;
                this.isDisabled = true;
                if (data['body']["success"] == 1) {
                  frmData.delete;
                  this.selectedProcessType = undefined;
                  this.project_dataitem.selectedImageType = "";

                  this.reset();
                  setTimeout(() => {
                    this.isDisabled = false;
                    this.fileuploading = "";
                    this.show = false;
                    this.uploadFilelists("");

                    this.snackBar.open("Images uploaded successfully", "close", {
                      duration: 2000,
                    });
                  }, 2000);
                  this.uploadFilelists("");
                  frmData.delete;

                } else {
                  this.isDisabled = false;
                  this.reset();
                }
              }
            }, err => {
              //console.log(err);
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
  //Get wtgs 

  getwtgs() {
    let obj = {
      id: this.project_name,
      params: {
        equip_id: ""
      }
    }
    this.commonService.getwtgs(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.wtgs = res['data']['equipments']
        
        this.tree_name = localStorage.getItem('tree_name');
        if(this.tree_name != "" || this.tree_name != undefined){

        
        let stringToSplit = this.tree_name;
        let newObj= stringToSplit.split(':')
        let wtg_name = newObj[0];
        let type = newObj[1]
        let obj ={
          wtg_name: newObj[0],
          type: newObj[1]
        }
        this.wtgs.forEach(wtg=>{
          if(wtg.wtg_name == wtg_name){
            //this.getWtgTypes(obj)
            return this.project_dataitem.wtg_name = wtg

          }
        })
      }
      
    }

    
  },(err) => {

  })
}
  

// Onchange events


getWtgTypes(obj) {
  if(obj.wtg_name != undefined){
    
    this.commonService.getWtgTypes('').subscribe((res) => {
      if (res['success'] == 1) {
        this.wtgTypes = res['data'];
      }
      else {
  
      }
  
    }, (err) => {
  
    })
  }
  else{
    this.wtgTypes = [];
    this.project_dataitem = {}
  }
 
}
// getBlades(obj){
//   this.uploadFilelists(obj);
//   if(obj.type == "Blades"){
//     this.bldeTypes = [
//       { value: 'Blade-A', name: 'Blade-A' },
//       { value: 'Blade-B', name: 'Blade-B' },
//       { value: 'Blade-C', name: 'Blade-C' }
//     ];
//   }
//   else{
//     this.bldeTypes = []
//   }
  
// }

  reset() {
    this.data = {
      wtg_name: this.wtg_name,
    }
    this.myFiles = [];

    this.filescount = "";
    this.selectImageType('');
    this.selectPlotOption('');
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
          this.uploadFilelists("");
        } else {

        }
      }, err => {
        // console.log(err);
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
        this.options = data['data'];
      } else {

      }
    }, err => {
      //console.log(err);
    });
  }
  uploadFilelists(obj) {
    console.log(obj)
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
    this.dataLoading = true;
    let datavalue = {}
    if(this.project_dataitem.wtg_name == undefined || this.data.wtg_name != undefined){
      datavalue = {
        "project_name": this.project_name,
        "project_type": this.project_type,
        "inverter_name": this.data.wtg_name || '',
        "inverter": "",
        "size": size,
        "offset": offset
      };
    }
   
    else if(this.project_dataitem.wtg_name != undefined){
      let wtg_name =this.project_dataitem.wtg_name.wtg_name + ':' + "Blades"
      datavalue = {
        "project_name": this.project_name,
        "project_type": this.project_type,
        "inverter_name": wtg_name || "",
        "inverter": obj.blade_name || "",
        "size": size,
        "offset": offset
      };
    }
    console.log(datavalue)
    this.commonService.getDataRetrieval(datavalue).subscribe(data => {
      if (data["success"] == 1) {
        this.uploadlists = data["data"];
        this.totalRecords = data["total_records"]
        
        if (this.uploadlists.length != 0) {
          this.hasData = false;
        }
        else {
          this.hasData = true;
        }
        this.dataSource = new MatTableDataSource(data["data"]);
        this.dataLoading = false;
        if(this.totalRecords < 10){
          this.paginator.pageIndex = 0;
        } 
        
        console.log(this.dataSource)
        this.ngAfterViewInit();

      } else {
        this.hasData = false;
        this.dataLoading = false;
      }
    }

    ), (err) => {
      this.dataLoading = false;
    };
  }

  ngAfterViewInit() {
    // if(this.dataSource != undefined){
    //   setTimeout(() => this.dataSource.paginator = this.paginator);
    // }
    
    //this.dataSource.sort = this.sort;
    //this.pager = this.uploadlists.length
    //this.dataSource.paginator.length;
  }

  initMap() { }

  onUnidentifiedSenddata(uploadlist: UploadModel) {

    localStorage.setItem('unidentified_details', JSON.stringify(uploadlist));
    this._router.navigate(['/un-identified']);
  }

  onSenddata(uploadlist: UploadModel) {
    // localStorage.setItem('viewimage_details', JSON.stringify(uploadlist));
    // this._router.navigate(['/viewimage']);
    // console.log(uploadlist)
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
  pageEvent(ev){
    console.log(ev);
  }
}
