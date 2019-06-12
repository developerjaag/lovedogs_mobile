import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';

import { Options } from 'fullcalendar';
import * as moment from 'moment';

import { ModalController, ToastController } from '@ionic/angular';
import { NewShedulePage } from '../new-shedule/new-shedule.page';
import { ScheduleDetailPage } from '../schedule-detail/schedule-detail.page';

import { MessagesService } from '../services/messages/messages.service';
import { SheduleService } from '../services/shedule/shedule.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  calendarOptions: OptionsInput;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  events = [];
  eventsModel: any;
  view = 'agendaWeek';

  constructor(private menu: MenuController, public modalController: ModalController, private messagesService: MessagesService,
    private sheduleService: SheduleService, public toastController: ToastController) {
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
      events: this.events,
      plugins: [dayGridPlugin, interactionPlugin]

    };
    this.loadEvents();
  } // end ngOnInit

  async loadEvents() {
    this.events = [];
    this.eventsModel = [];
    const toast = await this.toastController.create({
      message: 'Cargando citas...',
      position: 'middle',
    });
    toast.present();
    const me = this;
    const task = this.sheduleService.getSchedules();

    task
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.uid = doc.id;
          const object = {
            stick: true,
            id: data.uid,
            title: data.tittle,
            start: data.start,
            end: data.end,
            backgroundColor: data.backgroundColor,
            extendedProps: {
              uidOwner: data.uidOwner,
              uidPet: data.uidPet
            }
          };
          me.ucCalendar.fullCalendar('renderEvent', object, true);
          // me.events.push(object);
          me.eventsModel.push(object);
        });
        me.ucCalendar.fullCalendar('rerenderEvents');
        toast.dismiss();
        //  me.messagesService.closeLoading();
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
        // me.messagesService.closeLoading();
        me.messagesService.showAlert('Error!', 'Algo salió mal...');
      });

  }

  dayClick(model) {
    this.openModal(model.date.format());
  }

  navLinkDayClick(model?) {
    if (this.view === 'agendaWeek') {
      this.ucCalendar.fullCalendar('changeView', 'agendaDay');
      this.ucCalendar.fullCalendar('gotoDate', model.date);
      this.view = 'agendaDay';
    } else {
      this.ucCalendar.fullCalendar('changeView', 'agendaWeek');
      this.view = 'agendaWeek';
    }
  }

  eventClick(event) {
    this.openScheduleDetail(event);
  }

  async openScheduleDetail(schedule) {
    const modal = await this.modalController.create({
      component: ScheduleDetailPage,
      componentProps: {
        'schedule': schedule
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if ( data && data.reload ) {
      this.loadEvents();
    }
  }

  async openModal(date?) {
    let dateSend = '';
    if (date) {
      dateSend = date;
    }
    const modal = await this.modalController.create({
      component: NewShedulePage,
      componentProps: {
        'date': dateSend
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      // this.events.push(data.newSchedule);
      // this.ucCalendar.fullCalendar('renderEvent', data.newSchedule, true);
      // this.ucCalendar.fullCalendar('rerenderEvents');
      this.loadEvents();
    }

  } // end openModal

}// end class
