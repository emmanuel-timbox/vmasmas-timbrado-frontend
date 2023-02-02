import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})

export class EmployeComponent implements OnInit {

  name!: string;

  constructor() { }

  ngOnInit(): void {
    this.name = 'Hola mundo'
  }

  prueba(event: Event) {
    console.log(event)
    let value = (event.target as HTMLInputElement).value;
    this.name = value;
  }

}
