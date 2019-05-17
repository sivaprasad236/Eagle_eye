import { CommonServices } from './../../services/common-services';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { } from "googlemaps";
import { LoginModel } from '../../models/login.model';
import { environment } from '../../../environments/environment';
import { CreateProjectDialogComponent } from '../maindashboard/create-project-dialog/create-project-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})

export class MapComponent implements OnInit {
  @ViewChild('googleMap') gmapElement: any;
  map: google.maps.Map;

  foldernameId: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonServices, public dialog: MatDialog) {

    console.log(data);
  }

  ngOnInit() {
    this.getProductFromRoute();

  }

  getProductFromRoute(): void {

    const obj = {
      "folder": this.data.Folder_Name,
      "project": this.data.Project,
      "plot": this.data.plot,
      "imagetype": this.data.image_type,
      "type": this.data.Type
    }


    this.commonService.getViewmaps(obj).subscribe(
      data => {
        if (data["success"] == 1) {
          var markers123 = data['data'];
          console.log(data['data']);

          this.foldernameId = environment.API_URL + "/Outputfiles/" + this.data.Type + "/" + this.data.Project + "/" + this.data.plot + "/" + this.data.image_type + "/" + this.data.Folder_Name;

          var mapProp = {
            center: new google.maps.LatLng(0, 0),
            zoom: 40,
            // mapTypeId: google.maps.MapTypeId.ROADMAP
            mapTypeId: google.maps.MapTypeId.HYBRID
            // mapTypeId: google.maps.MapTypeId.SATELLITE
            // mapTypeId: google.maps.MapTypeId.TERRAIN
          };

          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

          this.setMultipleMarker(markers123, this.foldernameId, this);

        } else {

        }
      }
    );
  }

  setMultipleMarker(markers, foldersname, self) {

    markers.forEach(function (marker) {
      (function (marker) {
        let mark = new google.maps.Marker({
          position: new google.maps.LatLng(marker.Latitude, marker.Longitude)
          //icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        var contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +

          '<div id="bodyContent">' +
          '<img style="width:100px;" src="' + foldersname + "/" + marker.image_title + '"/>' +

          '</div>' +
          '</div>';

        let infowindow = new google.maps.InfoWindow({ content: contentString });
        infowindow.open(self.map, mark);
        mark.setMap(self.map);

        mark.addListener('click', function () {
          //alert(foldersname+"/"+marker.image_title);

        });

      })(marker)
    })
  }


}




