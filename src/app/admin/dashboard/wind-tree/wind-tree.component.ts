import { GlobalServices } from './../../../services/global-services';
import { EventEmitter } from '@angular/core';
import { CommonServices } from './../../../services/common-services';
import { Component, OnInit, Injectable, Output } from '@angular/core';
import { CollectionViewer, SelectionChange, SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
//import {BehaviorSubject, of as observableOf} from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

export class DynamicNode {
  constructor(
    public name: string,
    public docId: string,
    public plantDocId: number,
    public type: string,
    public s: string,
    public haschildren: boolean,
    public level: number = 1,
    public expandable: boolean = false,
    public isLoading: boolean = false,
    public childcount: number = -1,
    public children: DynamicNode[] = []
  ) { }
}

export class FlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

@Injectable()
export class DynamicDatabase {
  dfns: DynamicNode[];
  Tempchilddfns: DynamicNode[];
  apiToken: any;
  //dataMap: Map<any, any>;

  public getData(docId: string): Promise<any> {

    let url = this.GlobalServices.ApiUrls().getWind;
    this.apiToken = this.GlobalServices.getLocalItem('authentication', true)['data']['token'];

    let httpHeaders = new HttpHeaders()
    .set('Authorization', "Token "+this.apiToken)
    .set('Accept', 'application/json');
    return this.http.get(url+localStorage.getItem('project_name')+"?equip_id="+docId,
    {headers: httpHeaders}).toPromise().then((response: any) => response).catch(this.handleError);

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  constructor(private http: HttpClient, private GlobalServices:GlobalServices) {
  }

}

@Injectable()
export class DynamicDataSource {

  dataChange: BehaviorSubject<DynamicNode[]> = new BehaviorSubject<DynamicNode[]>([]);
 
  get data(): DynamicNode[] { return this.dataChange.value; }
  set data(value: DynamicNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }
  constructor(private treeControl: FlatTreeControl<DynamicNode>,
    private database: DynamicDatabase, private _router: Router) { }
  connect(collectionViewer: CollectionViewer): Observable<DynamicNode[]> {
    this.treeControl.expansionModel.onChange!.subscribe(change => {
      if ((change as SelectionChange<DynamicNode>).added ||
        (change as SelectionChange<DynamicNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }
  
  handleTreeControl(change: SelectionChange<DynamicNode>) {
    if (change.added) {

      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.reverse().forEach((node) => this.toggleNode(node, false));
    }
  }
  
  toggleNode(node: DynamicNode, expand: boolean) {
    //const children = this.database.getChildren(node.name);
    const index = this.data.indexOf(node);
   
    if (expand) {
      if (node.level == 3) {
        //console.log(node.name);
        localStorage.setItem('tree_name', node.name);
        this._router.navigate(['/wind']);
        return;
      }
      node.isLoading = true;
      if (node.children.length == 0) {
        const children = this.database.getData(node.docId).then(
          (res: any) => {
           
            const data = res["data"]["equipments"];

            const nodes = data.map(
              ContentNode =>
                new DynamicNode(
                  ContentNode.name,
                  ContentNode.docId,
                  ContentNode.plantDocId,
                  ContentNode.type,
                  ContentNode.s,
                  ContentNode.children,
                  node.level + 1,
                  ContentNode.expandable,
                  ContentNode.children))
            
            node.childcount = nodes.length;
            node.children = nodes;
            if (!children || index < 0) { // If no children, or cannot find the node, no op
              return;
            }
            this.data.splice(index + 1, 0, ...nodes);
            // notify the change
            this.dataChange.next(this.data);
            node.isLoading = false;
          })
          .catch(error => console.log(error));
      }
      else {
        this.data.splice(index + 1, 0, ...node.children);
        this.dataChange.next(this.data);
        node.isLoading = false;
      }
    } else {
      var counter = 0;
      for (var i = index + 1; i < this.data.length; i++) {
        if (this.data[i].level != node.level)
          counter++;
        if (this.data[i].level == node.level)
          i = this.data.length;
      }
      this.data.splice(index + 1, counter);//children.length
      this.dataChange.next(this.data);
    }
  }
}





@Component({
  selector: 'app-wind-tree',
  templateUrl: './wind-tree.component.html',
  styleUrls: ['./wind-tree.component.sass'],
  providers: [DynamicDatabase]
})
export class WindTreeComponent implements OnInit {
  project_name: string;
  project_type: string;
  username: string;

  public show:boolean = false;
  public buttonName:any = "hide.png";

  equip: any;

  tree_data: any;


  constructor(database: DynamicDatabase, private commonService: CommonServices, public _router: Router, public dialog: MatDialog) { 
    this.username = localStorage.getItem('loginusername');
    this.project_name = localStorage.getItem('project_name');
    //this.project_type = localStorage.getItem('project_type');

    this.treeControl = new FlatTreeControl<DynamicNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, _router);

      database.getData('').then(
        (res: any) =>{
          console.log(res);
          if(res["success"] == 1){
            const data = res["data"]["equipments"];
            this.dataSource.data = data.map(
              ContentNode =>
                new DynamicNode(
                  ContentNode.name,
                  ContentNode.docId,
                  ContentNode.plantDocId,
                  ContentNode.type,
                  ContentNode.s,
                  ContentNode.children,
                  0,
                  ContentNode.expandable,
                  ContentNode.children))
          }
        }
      ).catch(error => console.log(error));
  }

  ngOnInit(){
  }
  redirectWind(obj){
    if(obj.level == 0){
      localStorage.setItem('tree_name', "");
      this._router.navigate(['/wind']);
    }
  }
  toggle() {
    this.show = !this.show;

    if(this.show) {
      this.buttonName = "show.png";
    }
    else{
      this.buttonName = "hide.png";
      
    }
  }

  addNewItem(node: DynamicNode){
    console.log(node.name);
  }

  dataSource: DynamicDataSource;
  treeControl: FlatTreeControl<DynamicNode>;
  getLevel = (node: DynamicNode) => { return node.level; };
  isExpandable = (node: DynamicNode) => { return node.expandable; };
  hasChild = (_: number, _nodeData: DynamicNode) => { return _nodeData.expandable; };
  hasNoContent = (_: number, _nodeData: DynamicNode) => { return _nodeData.name === ''; };
  checklistSelection = new SelectionModel<DynamicNode>(true /* multiple */);

  //
  datesource2: MatTreeFlatDataSource<DynamicNode, FlatNode>;
  flatNodeMap = new Map<FlatNode, DynamicNode>();
  nestedNodeMap = new Map<DynamicNode, FlatNode>();
  selectedParent: FlatNode | null = null;
  newItemName = '';

  

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: DynamicNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: DynamicNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: DynamicNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: DynamicNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: DynamicNode): void {
    let parent: DynamicNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DynamicNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: DynamicNode): DynamicNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}
