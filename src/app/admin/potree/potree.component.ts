import { Component, OnInit, ViewChild, ElementRef, Inject } from "@angular/core";
import { EmbedVideoService } from 'ngx-embed-video';
import { environment } from "../../../environments/environment";
import { GlobalServices } from "./../../services/global-services";
import { CommonServices } from "./../../services/common-services";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ImageEditingComponent } from "../dashboard/image-editing/image-editing.component";

@Component({
  selector: "app-potree",
  templateUrl: "./potree.component.html",
  styleUrls: ["./potree.component.sass"]
})
export class PotreeComponent implements OnInit {
  yt_iframe_html: any;
  details: string;
  displayimgLists: any = [];
  path: string;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  drag: boolean;
  coordX: number;
  offsetX: any;
  coordY: number;
  offsetY: any;
  img: any;
  constructor(
    private embedService: EmbedVideoService,
    GlobalServices: GlobalServices,
    private commonService: CommonServices,
    // public dialogRef: MatDialogRef<PotreeComponent>, 
    // @Inject(MAT_DIALOG_DATA) public data: any
    public dialog: MatDialog
  ) {

    let details = localStorage.getItem('viewimage_details');
    this.details = JSON.parse(details);
    this.getProductFromRoute()
  }

  ngOnInit() {
    this.getvideoZooming();
    this.getDraggable();

  }
  getDraggable() {
    let v = document.getElementsByTagName('video')[0];
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
    v.addEventListener('mousedown', function (e) {
      v.style.cursor = "move"
      isDown = true;
      offset = [
        v.offsetLeft - e.clientX,
        v.offsetTop - e.clientY
      ];
    }, true);

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
    v.addEventListener('dblclick', function (e) {
      t = e.target;
      event.preventDefault();
      v.style.cursor = "context-menu"
      if (v.paused) {
        v.play();
        t.innerHTML = 'Pause';
      } else {
        v.pause();
        t.innerHTML = 'Play';
      }
    })
  }


  getImage() {
    return 'http://gee.greenko.net/app/videos/WTG_1.MP4'
  }
  getProductFromRoute() {
    const obj = {
      "folder": this.details['Folder_Name'],
      "project": this.details['Project'],
      "plot": this.details['plot'] || '',
      "imagetype": this.details['image_type'],
      "business_type": this.details['Type'],
      "wtg_name": this.details['wtg_name'] || '',
      "blade_name": this.details['blade_name'] || ''
    }
    this.commonService.getViewimage(obj).subscribe(data => {
      if (data["success"] == 1) {
        this.displayimgLists = data["data"];
        let plot;
        if (this.details['plot'] != undefined) {
          plot = this.details['plot'].replace(':', '-')
        }
        else {
          let wtg_name = this.details['wtg_name'].replace(':', '-')
          plot = wtg_name + "/" + this.details['blade_name']
        }
        this.path = environment.API_URL + "/TEST_SERVER/EagleEye/UploadImages/" + this.details['Type'] + "/" + this.details['Project'] + "/" + plot + "/" + this.details['image_type'] + "/" + this.details['Folder_Name'] + this.displayimgLists[0].files;
      } else {

      }
    });
  }
  onPlayerReady(ev) {
   
  }
  getvideoZooming() {

    let zoom = 1;
    let rotate = 0;

    /* Grab the necessary DOM elements */
    let stage = document.getElementById('stage'),
      v = document.getElementsByTagName('video')[0],
      controls = document.getElementById('controls');
    v.style.top = 0 + 'px';
    v.style.left = 0 + 'px';
    /* Array of possible browser specific settings for transformation */
    let properties = ['transform', 'WebkitTransform', 'MozTransform',
      'msTransform', 'OTransform'],
      prop = properties[0];

    /* Iterators and stuff */
    let i, j, t;

    /* Find out which CSS transform the browser supports */
    for (i = 0, j = properties.length; i < j; i++) {
      if (typeof stage.style[properties[i]] !== 'undefined') {
        prop = properties[i];
        break;
      }
    }


    /* If there is a controls element, add the player buttons */
    /* TODO: why does Opera not display the rotation buttons? */
    if (controls) {
      controls.innerHTML = '<div id="change">' +
        '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="play">Play</button>' + '&nbsp' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="zoomin">+</button>' + '&nbsp' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="zoomout">-</button>' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="left">⇠</button>' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="right">⇢</button>' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="up">⇡</button>' +
        // '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="down">⇣</button>' +
        '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="rotateleft">&#x21bb;</button>' +
        '<button style="cursor:pointer;padding:3px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="rotateright">&#x21ba;</button>' +
        '<button style="cursor:pointer;padding:3.5px 6px;background-color: #009688;margin-left:2px;border-radius:3px; border:1px solid #009688" class="reset">Reset</button>' +
        '</div>';
    }

    /* If a button was clicked (uses event delegation)...*/
    controls.addEventListener('click', function (e) {
      t = e.target;
      if (t.nodeName.toLowerCase() === 'button') {
        /* Check the class name of the button and act accordingly */
        switch (t.className) {

          /* Toggle play functionality and button label */
          case 'play':
            if (v.paused) {
              v.play();
              t.innerHTML = 'Pause';
            } else {
              v.pause();
              t.innerHTML = 'Play';
            }
            break;

          /* Increase zoom and set the transformation */
          case 'zoomin':
            zoom = zoom + 0.1;
            v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
            break;

          /* Decrease zoom and set the transformation */
          case 'zoomout':
            zoom = zoom - 0.1;
            v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
            break;

          /* Increase rotation and set the transformation */
          case 'rotateleft':
            rotate = rotate + 5;
            v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
            break;
          /* Decrease rotation and set the transformation */
          case 'rotateright':
            rotate = rotate - 5;
            v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
            break;

          /* Move video around by reading its left/top and altering it */

          case 'left':
            v.style.left = (parseInt(v.style.left, 10) - 5) + 'px';
            break;
          case 'right':
            v.style.left = (parseInt(v.style.left, 10) + 5) + 'px';
            break;
          case 'up':
            v.style.top = (parseInt(v.style.top, 10) - 5) + 'px';
            break;
          case 'down':
            v.style.top = (parseInt(v.style.top, 10) + 5) + 'px';
            break;

          /* Reset all to default */
          case 'reset':
            zoom = 1;
            rotate = 0;
            v.style.top = 0 + 'px';
            v.style.left = 0 + 'px';
            v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
            break;
        }

        e.preventDefault();
      }
    }, false);
  }

  getSnapshot() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
     ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, canvas.width, canvas.height);
    // const r = 2; // draw radius
    // ctx.lineWidth = r * 0.5;
    // ctx.lineCap = "round";
    // ctx.fillStyle = "black";
    // var draw = false;
    // var lineStart = true;
    // var lastX, lastY;
    // function yesDraw() { draw = true; lineStart = true }
    // function mouseMove(e) {
    //   const bounds = canvas.getBoundingClientRect();
    //   const x = e.pageX - bounds.left - scrollX;
    //   const y = e.pageY - bounds.top - scrollY;
    //   if (draw && x > -r && x < canvas.width + r && y > -r && y < canvas.height + r) {
    //     drawing(x, y);
    //   }
    // }
    // function noDraw() { draw = false }
    // document.addEventListener("mousemove", mouseMove);
    // document.addEventListener("mousedown", yesDraw);
    // document.addEventListener("mouseup", noDraw);
    // function drawing(x, y) {
    //   if (lineStart) {
    //     lastX = x;
    //     lastY = y;
    //     lineStart = false;
    //   }
    //   ctx.beginPath();
    //   ctx.lineTo(lastX, lastY);
    //   ctx.lineTo(x, y);
    //   ctx.stroke();
    //   lastX = x;
    //   lastY = y;

    // }

  }
  imageEdit(obj) {
    const dialogRef = this.dialog.open(ImageEditingComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  click() {
    this.drag = true;
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.img = canvas.toDataURL('image/jpeg');
  }

}