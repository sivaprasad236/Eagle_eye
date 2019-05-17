import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-windtree',
  templateUrl: './dialog-windtree.component.html',
  styleUrls: ['./dialog-windtree.component.sass']
})
export class DialogWindtreeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogWindtreeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

}
