import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready (() => {
      const trees: any = $('[data-widget = "treeview"]');
      trees.Treeview();
    });
  }

}
