import { environment } from './../../../environments/environment.prod';
import { CommonServices } from './../../services/common-services';
import { GlobalServices } from './../../services/global-services';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplayImageModel } from '../../models/viewimage.model';
import { InputUnIdentified } from '../../models/inputfield.model';
import { HttpErrorResponse, HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DataService } from '../../models/data.model';

@Component({
  selector: 'app-un-identified',
  templateUrl: './un-identified.component.html',
  styleUrls: ['./un-identified.component.sass']
})
export class UnIdentifiedComponent implements OnInit {

  displayimgLists: DisplayImageModel[];

  inputUnidentified: InputUnIdentified[] = [];
  inputUnidentifiedmulti: InputUnIdentified[] = [];

  foldername: number;

  submittingImage: boolean;

  isChecked: boolean = false;

  inputoption:string = '';

  @ViewChild('inputoption') searchInput: ElementRef;

  details: any;
  details1: any;


  options: string[] = ['10%', '20%', '30%', 'Cleaned', 'N/A'];

  emailFormArray: Array<any> = [];
  path: string;

  constructor(private location: Location, public dataService : DataService, private GlobalServices:GlobalServices,private httpService: HttpClient,public _dialog: MatDialog, private commonService: CommonServices, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.foldername = this.dataService.dataFromService;

    this.details = localStorage.getItem('unidentified_details');
    console.log(JSON.parse(this.details));

    this.details1 = JSON.parse(this.details);
  }

  ngOnInit() {
    this.getProductFromRoute();
  }

  onChange(displayimgLists: DisplayImageModel, inputoption, isChecked: boolean) {

    if(isChecked) {
         isChecked = true;
         let contact = new InputUnIdentified(displayimgLists._id, inputoption);
         this.inputUnidentifiedmulti.push(contact);
         //console.log(`received = ${JSON.stringify(this.inputUnidentifiedmulti)}`);
       
     } else {
       let index = this.emailFormArray.indexOf(displayimgLists._id);
       this.inputUnidentifiedmulti.splice(index,1);
     } 
}

  getProductFromRoute(): void {

    const obj = {
      "folder": this.details1.Folder_Name,
      "project": this.details1.Project,
      "plot": this.details1.plot,
      "imagetype": this.details1.image_type,
      "type": this.details1.Type
    }

    console.log(obj); 
    
  
    //console.log(`this.route.snapshot.paramMap = ${JSON.stringify(this.route.snapshot.paramMap)}`); 
    
    this.commonService.getViewmaps(obj).subscribe(data => {
      if(data["success"] == 1){
        this.displayimgLists = data["data"];
        this.path = environment.API_URL+"/Outputfiles/"+this.details1.Type+"/"+this.details1.Project+"/"+this.details1.plot+"/"+this.details1.image_type+"/"+this.details1.Folder_Name+"/";
      }else{
        this.snackBar.open("No Records Found", "close", {
          duration: 2000,
        });
      }
    }, err=>{
      console.log(err);
    });
  }

  unidentifiedSingle(displayimgLists: DisplayImageModel, inputoption) {
    
    if(inputoption == ""){
      this.GlobalServices.showSuccessMessage("This field is required");
    }else{
      let contact = new InputUnIdentified(displayimgLists._id, inputoption);
      this.inputUnidentified.push(contact);
      //console.log(`received = ${JSON.stringify(this.inputUnidentified)}`);

      const input = JSON.stringify(this.inputUnidentified);
      this.commonService.unidentified_solarpanel(input).subscribe(
        unidentifiedSingle => {
          if(unidentifiedSingle["success"] = 1){
            this.GlobalServices.showSuccessMessage(unidentifiedSingle["message"]);
            this.searchInput.nativeElement.value = '';
            this.inputUnidentified = [];
          }else{
            this.GlobalServices.showSuccessMessage(unidentifiedSingle["message"]);
            this.searchInput.nativeElement.value = '';
            this.inputUnidentified = [];
          }
        });
      }
    }

    unidentifiedMultiple(){
      if(this.searchInput.nativeElement.value == ""){
        this.GlobalServices.showSuccessMessage("This field is required");
      }else{
        let unidentifiedSolarurl = this.GlobalServices.ApiUrls().unidentifiedSolar;
        const input_multi = JSON.stringify(this.inputUnidentifiedmulti);
        //console.log(input_multi);

        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json;charset=UTF-8');

        this.httpService.post(unidentifiedSolarurl, input_multi, {headers: headers}
          ).subscribe(response => {
            if(response["success"]=1){
              window.alert(response['message']);
              //this.goBack();
            }else{
              window.alert(response['message']);
            } 
        }, err =>{
          //console.log("Error!");
          this.snackBar.open("Service not working", "close", {
            duration: 2000,
          });
      });
      }
    }


  }

  

