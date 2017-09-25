import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-awesome-button',
  templateUrl: './my-awesome-button.component.html',
  styleUrls: ['./my-awesome-button.component.css']
})
export class MyAwesomeButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    console.log('ya clicked');
  }

}
