import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'patient-detail',
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent implements OnInit {
  visible: boolean = true;
  @ViewChild('innerContent') innerContent: ElementRef;
  constructor() { }

  dynamicOnMount(attr: Map<string, string>, content: string) {
    console.log(arguments);
    this.innerContent.nativeElement.innerHTML = content;
  }

  ngOnInit() {
    
  }

  toggleContent() {
    this.visible = !this.visible;
}

}
