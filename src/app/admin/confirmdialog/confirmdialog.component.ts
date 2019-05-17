import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.sass']
})
export class ConfirmdialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>) {
    dialogRef.disableClose = true;
  }

  public confirmMessage:string;
  public note: string;

  ngOnInit() {
  }

}
