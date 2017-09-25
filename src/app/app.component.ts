import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  xml;
  hidden: boolean = false;
  

  loadContent() {
    $.ajax({
			headers: {
				Accept: "text/xml",
				'X-OA-AUTH-TOKEN': "awefwafwaefawefef"
			},
			method: 'POST',
			url: 'http://localhost:49938/handlers/WebApiHandler.ashx?action=/v1/ccda/export&ApiType=5',
			contentType: 'application/json',
			data: "{'PatientID':47022499,'TemplateName':'DefaultExportTemplate.xml','StartDate':'2017-04-20T22:51:43.647Z','EndDate':'2017-09-20T22:51:43.647Z'}"
		}).done(function(cdaxml, message, xhr) {
			this.xml = cdaxml;
      this.hidden = true;
		}.bind(this));
  }

  loadFile(file: string) {
    this.xml = file;
    this.hidden = true;
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
