import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MarkerArea } from 'markerjs';
import { AiaImageAnnotatorComponent } from 'angular-image-annotator';


     

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.sass']
})
export class ImageEditingComponent implements OnInit {
  myImage;
  @ViewChild('annotator') annotator: AiaImageAnnotatorComponent;
  
  toolbar: any;
  res: any;
  element: HTMLImageElement;
  constructor(public dialogRef: MatDialogRef<ImageEditingComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit() {
    this.myImage = this.data
    //this.getDraggable();
    //this.element.crossOrigin = "Anonymous"
    this.element= document.getElementById('image') as HTMLImageElement
    this.toolbar = new MarkerArea(this.element);
    //this.element.crossOrigin = "Anonymous"
    this.toolbar.show(
      
        (dataUrl) => {
            this.res = document.getElementById("resultImage") as HTMLImageElement;
            
            this.res.src = dataUrl;
        }
    );
  }
  getDraggable() {
    let v = document.getElementsByTagName('image')[0]
   // let v = document.getElementsByTagName('video')[0];
    let stage = document.getElementById('stage')
    v.style.cursor = "context-menu"
    var mousePosition;
    let offset = [0, 0];
    let div;
    let isDown = false;
    let zoom = 1;
    let rotate = 0;

    v.style.position = "absolute";
    v.style.left = "0px";

    let properties = ['transform', 'WebkitTransform', 'MozTransform',
      'msTransform', 'OTransform'],
      prop = properties[0];
    let i, j, t;
    for (i = 0, j = properties.length; i < j; i++) {
      if (typeof stage.style[properties[i]] !== 'undefined') {
        prop = properties[i];
        break;
      }
    }
    // v.addEventListener('mousedown', function (e) {
    //   v.style.cursor = "move"
    //   isDown = true;
    //   offset = [
    //     v.offsetLeft - e.clientX,
    //     v.offsetTop - e.clientY
    //   ];
    // }, true);

    v.addEventListener('mouseup', function () {
      v.style.cursor = "move"
      isDown = false;
    }, true);

    v.addEventListener('mousemove', function (event) {

      event.preventDefault();
      if (isDown) {
        v.style.cursor = "move"
        mousePosition = {

          x: event.clientX,
          y: event.clientY

        };
        v.style.left = (mousePosition.x + offset[0]) + 'px';
        v.style.top = (mousePosition.y + offset[1]) + 'px';
      }
    }, true);

    v.addEventListener('wheel', function (e) {

      event.preventDefault();
      if (e.deltaY < 0) {
        v.style.cursor = "zoom-in"
        zoom = zoom + 0.1;
        v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
      }
      if (e.deltaY > 0) {
        v.style.cursor = "zoom-out"
        zoom = zoom - 0.1;
        v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
      }
    })
    // v.addEventListener('dblclick', function (e) {
    //   t = e.target;
    //   event.preventDefault();
    //   v.style.cursor = "context-menu"
    //   if (v.paused) {
    //     v.play();
    //     t.innerHTML = 'Pause';
    //   } else {
    //     v.pause();
    //     t.innerHTML = 'Play';
    //   }
    // })
  }
  
  ngOnDestroy() {
    this.toolbar.close();
  }
}
