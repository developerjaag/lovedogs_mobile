import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';

import { Options } from 'fullcalendar';
import * as moment from 'moment';

import { ModalController } from '@ionic/angular';

import { NewShedulePage } from '../new-shedule/new-shedule.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  calendarOptions: OptionsInput;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  events = [];
  view = 'agendaWeek';

  constructor(private menu: MenuController, public modalController: ModalController) {
    this.menu.enable(true, 'first');
  }

  ngOnInit() {
    this.calendarOptions = {
      height: 650,
      locale: 'es',
      defaultView: 'agendaWeek',
      header: {
        left: '',
        center: '',
        right: 'today prev,next'
      },
      buttonText: {
        today: 'Hoy'
      },
      allDaySlot: false,
      minTime: '06:00:00',
      nowIndicator: true,
      editable: true,
      eventLimit: false,
      navLinks: true,
      events: [
        {
          id: 'id3',
          title: 'Kiana',
          start: '2019-04-12T12:30:00',
          end: '2019-04-12T13:30:00'
        },
        {
          id: 'id2',
          title: 'Romeo',
          start: '2019-03-13T15:30:00',
          duration: '02:00:00'
        }
      ],
      plugins: [dayGridPlugin, interactionPlugin]

    };
  } // end ngOnInit

  dayClick(model) {
    this.openModal(model.date.format());
  }

  navLinkDayClick(model?) {

    if (this.view === 'agendaWeek') {
      this.ucCalendar.fullCalendar( 'changeView', 'agendaDay' );
      this.ucCalendar.fullCalendar('gotoDate', model.date);
      this.view = 'agendaDay';
    } else {
      this.ucCalendar.fullCalendar( 'changeView', 'agendaWeek' );
      this.view = 'agendaWeek';
    }
  }

  eventClick(event) {
    console.log(event);
    // click on event
  }

  addEvent2() {
    const event = {
      id: 'added',
      title: 'Zack',
      start: '2019-04-08T11:30:00',
      duration: '00:30:00'
    };

    this.ucCalendar.fullCalendar('renderEvent', event);
    this.ucCalendar.fullCalendar('rerenderEvents');
  }


  async openModal(date?) {
    let dateSend = '';
    if (date) {
      dateSend =  date;
    }
    const modal = await this.modalController.create({
      component: NewShedulePage,
      componentProps: {
        'date': dateSend
      }
    });
    await modal.present();
  }

}// end class
