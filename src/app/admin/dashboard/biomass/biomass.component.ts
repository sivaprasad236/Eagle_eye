import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MapComponent } from '../../map/map.component';



@Component({
  selector: 'app-biomass',
  templateUrl: './biomass.component.html',
  styleUrls: ['./biomass.component.sass']
})
export class BiomassComponent implements OnInit {
 

  constructor(public _dialog: MatDialog) {
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
