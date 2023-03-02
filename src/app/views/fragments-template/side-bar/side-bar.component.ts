import { Component, OnInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('[data-widget="treeview"]').Treeview('init');
    var ultimoClic = new Date();
    localStorage.setItem('ultimoClic', ultimoClic.getTime().toString());
  }

}
