import { environment } from './../../../environments/environment';
import { CommonServices } from '../../services/common-services';
import { GlobalServices } from '../../services/global-services';
import { HttpServices } from '../../services/http-services';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryAction, NgxGalleryImageSize } from 'ngx-gallery';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatCardMdImage } from '@angular/material';
import * as moment from 'moment';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { NgForm } from '@angular/forms';
import { PotreeComponent } from '../potree/potree.component';
import { ImageEditingComponent } from '../dashboard/image-editing/image-editing.component';



@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.html',
  styleUrls: ['./view-image.sass']
})
export class ViewimageComponent implements OnInit, OnChanges {

  details: any;
  details1: any;
  displayimgLists: any;
  data: any = {} 
  path: any;
  viewImages: any = []
  step = 0;
  image:any;
  wtg: any;
  bladeName: any;
  panelOpenState = false;
  slideIndex = 0;
  // data: any ={
  // }

  editable:boolean = false;
  imageLoader = true;

  defaultImage = "http://10.80.17.45:8080/loading.gif";
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  actions: NgxGalleryAction[];
  images:any = [];
  dynamicInputs: { name: string; value: string; image: [],imageUrl:any[] }[];
  plot: any;
  visitorPicDataUrl: string | ArrayBuffer;
  comments: any[];
  reports: any =[];
  retrivedImage: any;
  inputDisabled: boolean = true;
  reportCount: any;
  constructor(private GlobalServices: GlobalServices,
    public _dialog: MatDialog,
    private commonService: CommonServices,
    private http: HttpServices,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private httpClient: HttpClient) {
    this.details = localStorage.getItem('viewimage_details');
    this.details1 = JSON.parse(this.details);
    if(this.details1.wtg_name != undefined){
      let wtg_name = this.details1.wtg_name
      let wtg = wtg_name.split(':')
      this.wtg = wtg[0];
      this.bladeName = this.details1.blade_name
    }
  
    this.data['inverter'] = this.details1['plot']
  }
 
  ngOnInit() {
    
    this.getProductFromRoute();
    this.getReports()
    this.dynamicInputs = [{
      name: this.plot,
      value: '',
      image: [],
      imageUrl: []
    }]
    this.comments = [{comment:""}]
    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnailsColumns: 6,
        imagePercent: 100,
        previewZoomStep: 0.2,
        previewZoomMax: 5,
        imageSize: NgxGalleryImageSize.Contain,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
        previewZoom: true,
        imageDescription: true,
        previewDownload: true

      },
      // max-width 800
      {
        breakpoint: 544,
        width: '100%',
        height: '200px',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 200,
        preview: true
      },

    ];
   

  }
  imagerUpload(){
      return (this.data['image'])
      ? this.data['image'] : 'assets/images/upload2.png';

  }
  imagerUpload1(i){

    return (this.reports[i]['FILE_PATH'])
      ? environment.API_URL +"/" + this.reports[i]['FILE_PATH'] : 'assets/images/upload2.png';
  }
  
  getProductFromRoute(): void {
    const obj = {
      "folder": this.details1.Folder_Name,
      "project": this.details1.Project,
      "plot": this.details1.plot || '',
      "imagetype": this.details1.image_type,
      "business_type": this.details1.Type,
      "wtg_name": this.details1.wtg_name || '',
      "blade_name": this.details1.blade_name || ''
    }
    this.commonService.getViewimage(obj).subscribe(data => {
      if (data["success"] == 1) {
        this.displayimgLists = data["data"];
        let plot;
        if(this.details1.plot != undefined){
          plot = this.details1.plot.replace(':', '-')
        }
        else{
          let wtg_name = this.details1.wtg_name.replace(':', '-')
          plot = wtg_name + "/" + this.details1.blade_name
        }
        this.path = environment.API_URL + "/UploadImages/" + this.details1.Type + "/" + this.details1.Project + "/" + plot + "/" + this.details1.image_type + "/" + this.details1.Folder_Name;
        this.displayimgLists.forEach(element => {
          let des = element.files.substring(1);
          let obj =
          {
            small: environment.API_URL + "/TEST_SERVER/thumbnails/" + this.details1.Type + "/" + this.details1.Project + "/" + plot + "/" + this.details1.image_type + "/" + this.details1.Folder_Name + element.files,
            medium: environment.API_URL + "/TEST_SERVER/thumbnails/" + this.details1.Type + "/" + this.details1.Project + "/" + plot + "/" + this.details1.image_type + "/" + this.details1.Folder_Name + element.files,
            big: environment.API_URL + "/TEST_SERVER/UploadImages/" + this.details1.Type + "/" + this.details1.Project + "/" + plot + "/" + this.details1.image_type + "/" + this.details1.Folder_Name + element.files,
            description: des,
          }
          this.viewImages.push(obj)
        });
        this.galleryImages = this.viewImages;
        this.images = this.viewImages;
        //this.showSlides(this.slideIndex);
      } else {
        this.snackBar.open("Service not working", "close", {
          duration: 2000,
        });
      }
    });
  }
  back(){
    if(this.details1.Type === 'wind'){
    this.router.navigate(['/wind'])
    }
    else{
      this.router.navigate(['/solar'])
    }
  }
  backProject(){
    if(this.details1.Type === 'wind'){
      this.router.navigate(['/wind-tree'])
      }
      else{
        this.router.navigate(['/solar-tree'])
      }
  }
  click(files, obj) {
    let url = "text";
    const a = document.createElement('a');
    a.href = obj
    a.download = 'comprobante.jpg';
    //a.target = self;
    document.body.appendChild(a);
    a.click();

  }

  /* public onError(): void {
    this.path = this.defaultImage;
  } */

  onChange(ev1) {
    this.image = ev1
    //this.cdRef.detectChanges();
  }
  ngOnChanges() {
  }
  
  submit(form: NgForm) {
      let frmData = new FormData();
      debugger
      if(this.data['image'] == undefined || this.comments[0].comment == ""){
        this.GlobalServices.showSuccessMessage("Required")
      }
      else{
        let comments=[]
      frmData.set('comments', JSON.stringify(this.comments));
      frmData.set("folder",this.details1.Folder_Name) 
      frmData.set("project", this.details1.Project)
      frmData.set( "plot", this.details1.plot || '')
      frmData.set( "img_type", this.details1.image_type)
      frmData.set( "business_type", this.details1.Type)
      frmData.set("wtg_name", this.details1.wtg_name || '')
      frmData.set( "blade_name", this.details1.blade_name || '')
      frmData.set( "Date", this.details1.Date)   
      frmData.set( "file", this.data.file) 
      let obj = {
        frmdata:frmData
      }
      this.commonService.report(obj).subscribe(res=>{
        if(res["success"] == 1){
          this.GlobalServices.showSuccessMessage(res['message'])
          this.getReports()
          form.reset();
          this.comments = [{comment:""}]
          this.data['image']= null;
         
        }
        else{
          
          //this.GlobalServices.showErrorMessage(res['message'])
        }
      },
      err=>{
        
        //this.GlobalServices.showErrorMessage(err.err)
      })
      }
      
// business_type
 
// plot (for solar)
 
// wtg_name (for wind)
// blade_name (for wind)
 
// img_type
// project
// date
 
// file (images)
    // this.dynamicInputs.forEach(ele =>{
    //   let img = [];
    //   frmData.set('inverterNo', ele.name)
    //   frmData.set('inverterNo', ele.name)
    //   img = ele['image'];
    //   img.forEach(frm =>{
    //     frmData.set('image', frm)
    //   })
    // })
    // this.commonService.report('').subscribe(res=>{
    //   console.log(res);
    // })
  }
 
  dynamicForm() {

    this.dynamicInputs.push({ name: this.plot, value: "", image: [], imageUrl:[] });
    
  }

  // Delete dynamic input

  delete(ev, i, j){
    this.reports[i].COMMENTS.splice(j, 1)
  }

  editDynamicNotes(ev, i){
    ev.preventDefault();
    this.reports[i].COMMENTS.push({comment:'' })
  }
  selectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.dynamicInputs[i].imageUrl = []
      this.data['file'] = event.target.files[0];
      let files = event.target.files
     // this.dynamicInputs[i].image = this.image;
      for(let file of files){
        var reader = new FileReader();
        reader.onload = (e: any) => {
          //this.dynamicInputs[i].imageUrl.push(e.target.result);
          this.data['image']= e.target.result
        }
        reader.readAsDataURL(file);
      }
      
    }
   
      


  }

  selectFile1(event, index){
 //this.dynamicInputs[i].imageUrl = []
 let files = event.target.files
// this.dynamicInputs[i].image = this.image;
 for(let file of files){
   var reader = new FileReader();
   reader.onload = (e: any) => {
     //this.dynamicInputs[i].imageUrl.push(e.target.result);
     this.retrivedImage = e.target.result
   }
   reader.readAsDataURL(file);
 }
 

  }

  remove(i,j){
   
    this.dynamicInputs[i].imageUrl.splice(j,1)
  }
 
  getImage(i){
    return (this.dynamicInputs[i].imageUrl.length>0)
      ? this.dynamicInputs[i].imageUrl : 'assets/images/solar.png';
  }

  dynamicNotes(e){
    e.preventDefault();
      this.comments.push({comment:'' })
}
// Create dynamic row deletion 
deleteDynamicRow(ev, i){
this.comments.splice(i,1);
}
  getReports(){
    const currentTime = new Date(this.details1.Date);    
const date = moment(currentTime).format("YYYY-MM-DD");
    let obj ={
      params:{
        plantname:this.details1.Project,
        plot:this.details1.plot || "",
        date:date,
        business_type: this.details1.Type,
        wtg_name: this.details1.wtg_name || ""
      }
    }
    this.commonService.getReports(obj).subscribe(res =>{
      this.reports = res['data'];
      this.reportCount = this.reports.length
    })
  }
  setStep(index: number) {
    this.panelOpenState = true;
    this.step = index;
    this.inputDisabled = false
    this.editable = false
  }
  closed1(index: number){
    this.panelOpenState = false;
    this.step = index;
    this.inputDisabled = false
    this.editable = false
  }

  nextStep() {
    this.step++;
    this.inputDisabled = false
    this.editable = false
  }

  prevStep() {
    this.step--;
    this.inputDisabled =  false;
    this.editable = false
  }
  editReport(report, i){
    let frmData = new FormData();
    frmData.set('comments', JSON.stringify(report.COMMENTS));
    frmData.set('id', JSON.stringify(report.id));
    let obj = {
      frmdata:frmData
    }
    this.commonService.editReport(obj).subscribe(res =>{
      this.GlobalServices.showSuccessMessage(res['message'])
      this.getReports()
    })
  }

  edit(i){
    this.editable = true
    this.inputDisabled = true
    
  }
  cancel(){
    this.editable = false
    this.inputDisabled = false
  }
  download(){
    alert("Coming soon....")
  }
  
  //let slides = document.querySelectorAll('#selector, .mySlides')
  //let slides:Element = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>
  //console.log(slides)
  
}



