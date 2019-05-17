import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MapComponent } from '../../map/map.component';



@Component({
  selector: 'app-hydro',
  templateUrl: './hydro.component.html',
  styleUrls: ['./hydro.component.sass']
})
export class HydroComponent implements OnInit {
  project_name: string;
  project_type: string;
 

  constructor(public _dialog: MatDialog) {
    this.project_name = localStorage.getItem('project_name');
    this.project_type = localStorage.getItem('project_type');

  }

  ngOnInit() {
  }
  viewMap() {
    const dialogRef = this._dialog.open(MapComponent, {
      height: '90%',      
      panelClass: 'map-dialog',
      width: '90%',
      
    });

   

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  

}
