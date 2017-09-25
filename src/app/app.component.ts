import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  xml;
  content;
  

  loadContent() {
    this.content = `
    <article>
      <h1>Awesome Document</h1>
      <div>
        <p>bla bla bla</p>
        <my-awesome-button></my-awesome-button>
      </div>
    </article>
    `;
  }

  loadFile(file: string) {
    this.xml = file;
  }

  loadtextarea(fname){
    let xmload = new XMLHttpRequest();
    xmload.onreadystatechange = function() {
      if (xmload.readyState == 4) {
        $('#cdaxml').val(xmload.responseText)
      }
    };
    try{
      xmload.open("GET", fname,true);
    }
    catch(e){alert(e)}
    xmload.send(null);
  }

  view() {
    this.xml = $('#cdaxml').val();
  }

  ngAfterViewInit(): void {
       
    
    // $(document).ready(function(){
    //   // Input CDA Document
    //   $('.viewbtn').off('click').click(function(){
    //     var id_target=$(this).attr('id_target');
    //     $('.cdaview:not([id="'+id_target+'"])').hide()
    //     $('#'+id_target).show()
    //   });
    // });            
  }

    constructor() { }
  
    ngOnInit() {
 
    }
  }
