import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var $: any;
declare var Draggabilly: any;
import { Transformation } from '../../assets/js/xslt/xslt';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-ccda-viewer',
  templateUrl: './ccda-viewer.component.html',
  styleUrls: ['./ccda-viewer.component.css']
})
export class CcdaViewerComponent implements OnInit, AfterViewInit {
  @Input()
  public set cdaxml(val: string) {
    console.log('test');
    new Transformation().setXml(val).setXslt('assets/cda.xsl').setCallback(this.startUp.bind(this)).transform("viewcda");
  }

  transformedCCDA;
  firstSection: any[] = [];
  collapseAll: boolean = false;
  hidden: any[] = [];

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    // Check local storage
    //$('#storagemsg').text('Your browser does not have localStorage - your preferences will not be saved');
    this.collapseAll = (this.localStorageService.get<boolean>('collapseAll')) ? this.localStorageService.get<boolean>('collapseAll') : false;
    this.hidden = (this.localStorageService.get<any[]>('hidden')) ? this.localStorageService.get<any[]>('hidden') : [];
    this.firstSection = (this.localStorageService.get<any[]>('firstSection')) ? this.localStorageService.get<any[]>('firstSection') : [];
    console.log(this.localStorageService.get('testing'))
  }

  ngAfterViewInit(): void {

  }

  startUp(ccda) {
    if (ccda) {
      var div = document.createElement('div');
      div.appendChild(ccda);
      this.transformedCCDA = div.innerHTML;
    } else {
      this.transformedCCDA = document.getElementById('viewcda').innerHTML;
    }

    // need templates to compile 
    setTimeout(() => {
      this.init();
    }, 100);

  }

  init() {
    var sectionorder = [];
    const self = this;

    $('li.toc[data-code]').each(function () {
      sectionorder.push($(this).attr('data-code'))
    });

    $('.minimize').click(function (event) {
      let section = $(this).closest('.section');
      $(this).toggleClass('fa-compress fa-expand');
      let sectiondiv = $(this).closest('div.section_in').find('div:last');
      sectiondiv.slideToggle(function () {
        self.adjustWidth(section);
      });
    });
    let cdabody = $('#cdabody');
    cdabody.find('div.section').each(function () {
      var sect = $(this);
      $(this).hover(
        function () {
          $(this).find('.controls').show();
        },
        function () {
          $(this).find('.controls').hide();
        });
      $(this).find('table').each(function () {
        var tbl = $(this);
        if (tbl.width() > sect.width()) {
          sect.width(tbl.width() + 20);
        }

        var c = tbl.find('tr.duplicate').length;
        if (c > 0) {
          if (c == 1)
            var s = $('<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' + c + ') duplicate row hidden. Click here to <span class="show">show</span>.</td></tr>')
          else
            var s = $('<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' + c + ') duplicate rows hidden. Click here to <span class="show">show</span>.</td></tr>')
          tbl.prepend(s).on('click', 'tr.all', function () {
            if ($(this).find('.show').text() == 'show') {
              $(this).find('.show').text('hide');
              tbl.find('tr.duplicate').show();
            }
            else {
              $(this).find('.show').text('show');
              tbl.find('tr.duplicate').hide();
            }
            $('#cdabody').packery();
          });
        }
        c = tbl.find('tr.duplicatefirst').length;
        if (c > 0) {
          if (c == 1)
            var s = $('<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' + c + ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>');
          else
            var s = $('<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' + c + ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>');
          tbl.prepend(s).on('click', 'tr.first', function () {
            if ($(this).find('.show1').text() == 'show') {
              $(this).find('.show1').text('hide');
              tbl.find('tr.duplicatefirst').show();
            }
            else {
              $(this).find('.show1').text('show');
              tbl.find('tr.duplicatefirst').hide();
            }
            $('#cdabody').packery();
          })
        }
      });
    });

    cdabody.packery({
      stamp: '.stamp',
      columnWidth: 'div.section:not(.narr_table)',
      //columnWidth: 160,
      transitionDuration: '0.2s',
      itemSelector: 'div.section',
      gutter: 10
    });
    cdabody.find('div.section:not(.recordTarget)').each(function (i, gridItem) {
      var draggie = new Draggabilly(gridItem);
      // bind drag events to Packery
      cdabody.packery('bindDraggabillyEvents', draggie);
    });

    cdabody.on('dragItemPositioned', function () {
      self.orderItems();
    });

    $('.toc').off('click').click(function () {
      var section = $('.section[data-code="' + $(this).attr('data-code') + '"]');
      if (section.is(':visible')) {
        section.fadeOut(function () {
          $('#cdabody').packery();
          if (self.hidden.indexOf(section.attr('data-code')) == -1) {
            self.hidden.push(section.attr('data-code'));
            self.localStorageService.set('hidden', self.hidden);
          }
        });
        $(this).addClass('hide');
        $(this).find('i.tocli').removeClass('fa-check-square-o').addClass('fa-square-o');
      }
      else {
        section.addClass('fadehighlight').fadeIn(function () {
          $('#cdabody').packery();
          $(this).removeClass('fadehighlight');
          self.hidden.splice(self.hidden.indexOf(section.attr('data-code')), 1);
          self.localStorageService.set('hidden', self.hidden);
        });
        $(this).removeClass('hide');
        $(this).find('i.tocli').removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      th = $('#tochead');
      if ($('li.hide.toc[data-code]').length != 0) {
        if (th.find('i.fa-warning').length == 0)
          th.prepend('<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>');
      }
      else {
        th.find('i.fa-warning').remove();
      }
    });
    $('#tochead').off('click').click(function () {
      $('#toc').slideToggle(function () {
        $('#cdabody').packery();
      });
    });
    $('.tocup').off('click').click(function (event) {
      var li = $(this).parent();
      var section = $('.section[data-code="' + li.attr('data-code') + '"]');
      self.moveUp(section, li, true);
      event.stopPropagation();
      event.preventDefault();
    });
    $('.tocdown').off('click').click(function (event) {
      var li = $(this).parent();
      var section = $('.section[data-code="' + li.attr('data-code') + '"]');
      self.moveDown(section, li, true);
      event.stopPropagation();
      event.preventDefault();
    });
    $('.sectionup').click(function (event) {
      var section = $(this).closest('.section');
      var li = $('.toc[data-code="' + section.attr('data-code') + '"]');
      self.moveUp(section, li, true);
    });
    $('.sectiondown').click(function (event) {
      var section = $(this).closest('.section');
      var li = $('.toc[data-code="' + section.attr('data-code') + '"]');
      self.moveDown(section, li, true);
    });

    $('.hideshow').click(function (e) {
      e.preventDefault();
      var up = $(this).find('i').hasClass('fa-compress');

      if (up) {
        $('div.sectiontext').slideUp(function () {
          self.adjustWidth($(this).parent().parent());
        });
        $('.minimize').addClass('fa-expand').removeClass('fa-compress');
      }
      else {
        $('div.sectiontext').slideDown(function () {
          self.adjustWidth($(this).parent().parent());
        });
        $('.minimize').addClass('fa-compress').removeClass('fa-expand');
      }
      $('#cdabody').packery();
      $('.hideshow').find('i').toggleClass('fa-compress fa-expand');
      self.localStorageService.set('collapseAll', up);
    });
    $('#showall').click(function () {
      self.localStorageService.set('hidden', []);
      $('.section').each(function () {
        $(this).show();
        var code = $(this).attr('data-code');
        $('.toc[data-code="' + code + '"]').removeClass('hide').find('i.tocli').addClass('fa-check-square-o').removeClass('fa-square-o');
      });
      $('#cdabody').packery();
      let th = $('#tochead');
      th.find('i.fa-warning').remove();
    });
    $('i.delete').click(function () {
      var section = $(this).closest('div.section');
      section.fadeOut(function () {
        var code = section.attr('data-code');
        if (self.hidden.indexOf(code) == -1) {
          self.hidden.push(code);
          self.localStorageService.set('hidden', self.hidden);
        }
        cdabody.packery();
        $('.toc[data-code="' + code + '"]').addClass('hide').find('i.tocli').removeClass('fa-check-square-o').addClass('fa-square-o');
        var th = $('#tochead');
        if ($('li.hide.toc[data-code]').length != 0) {
          if (th.find('i.fa-warning').length == 0)
            th.prepend('<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>');
        }
        else {
          th.find('i.fa-warning').remove();
        }
      });
    });


    // collapse all logic
    if (!this.collapseAll) {
      $('.hideshow').find('i').addClass('fa-compress').removeClass('fa-expand');
      $('.minimize').addClass('fa-compress').removeClass('fa-expand');
    }
    else {
      $('div.sectiontext').hide(function () {
        self.adjustWidth($(this).parent().parent());
      });
      $('.hideshow').find('i').addClass('fa-expand').removeClass('fa-compress');
    }

    // hidden logic
    var ihid = 0;
    for (let i = 0; i < self.hidden.length; i++) {
      if ((self.hidden[i] !== undefined) && (self.hidden[i] != "")) {
        var section = $('.section[data-code="' + self.hidden[i] + '"]')
        section.hide();
        $('.toc[data-code="' + self.hidden[i] + '"]').addClass('hide').find('i.tocli').removeClass('fa-check-square-o').addClass('fa-square-o');
        ihid++;
      }
    }
    if (ihid > 0) {
      let th = $('#tochead');
      th.prepend('<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="' + ihid + ' sections are hidden"></i>');
    }

    // first section logic
    if (this.firstSection.length > 1) {
      for (let i = this.firstSection.length - 1; i > -1; i--) {
        if ((this.firstSection[i] !== undefined) && (this.firstSection[i] != "")) {
          let section = $('.section[data-code="' + this.firstSection[i] + '"]');
          let li = $('.toc[data-code="' + section.attr('data-code') + '"]');
          this.moveUp(section, li, false);
          sectionorder.splice(sectionorder.indexOf(this.firstSection[i]), 1);
        }
      }
    }
    for (let i = 0; i < sectionorder.length; i++) {
      this.firstSection.push(sectionorder[i]);
    }
    $('#cdabody').packery('reloadItems');
    $('#cdabody').packery();
    let d = new Date();
    this.localStorageService.set('lastAccess', `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`);

  }

  adjustWidth(section) {
    let s = section.attr('style');
    let is = s.indexOf('width:');

    if (is > -1) {
      let ie = s.indexOf('px;');
      let sStart = s.substring(0, is);
      let sEnd = s.substring(is, s.length);
      ie = sEnd.indexOf('px;');
      sEnd = sEnd.substring(ie + 3, sEnd.length);
      s = sStart + sEnd;
      section.attr('style', s);
    }

    if (section.find('table').length > 0) {
      if (section.find('table').width() > section.width())
        section.width(section.find('table').width() + 20);
    }
    $('#cdabody').packery();
  }

  orderItems() {
    let firstSection = [];
    let restore = $('#restore');
    let itemElems = $('#cdabody').packery('getItemElements');
    $(itemElems).each(function (i, itemElem) {
      let code = $(itemElem).attr('data-code');
      firstSection.push(code);
      let li = $('.toc[data-code="' + code + '"]');
      restore.before(li);
    });
    this.localStorageService.set('firstSection', firstSection);
  }

  moveDown(section, li, bRefresh) {
    let curr = li;
    curr.fadeOut(function () {
      let t = curr.next('[data-code]');
      t.after(curr);
      curr.fadeIn();
    });

    let f = section.next();
    f.after(section);
    if (bRefresh) {
      let code = section.attr('data-code');
      if (this.firstSection.indexOf(code) == -1) {
        this.firstSection.unshift(code);
      }
      else {
        let pos = this.firstSection.indexOf(code);
        if (pos < this.firstSection.length) {
          let b = this.firstSection[pos + 1];
          this.firstSection[pos + 1] = this.firstSection[pos];
          this.firstSection[pos] = b;
        }
        this.localStorageService.set('firstSection', this.firstSection);
      }
      $('#cdabody').packery('reloadItems');
      $('#cdabody').packery();
    }
  }

  moveUp(section, li, bRefresh) {
    let curr = li;
    curr.fadeOut(function () {
      let t = li.parent().find('li:first');
      t.before(curr);
      curr.fadeIn();
    });

    //section
    let f = section.parent().find('div.section:eq(0)');
    f.before(section);
    if (bRefresh) {
      let code = section.attr('data-code');
      if (this.firstSection.indexOf(code) == -1) {
        this.firstSection.unshift(code);
      }
      else {
        this.firstSection.splice(this.firstSection.indexOf(code), 1);
        this.firstSection.unshift(code);
      }
      this.localStorageService.set('firstSection', this.firstSection);
      $('#cdabody').packery('reloadItems');
      $('#cdabody').packery();
    }
  }
}
