import { Component, OnInit, ViewChild } from "@angular/core";
import { MenuController } from "@ionic/angular";

import { CalendarComponent } from "ng-fullcalendar";
import { Options } from "fullcalendar";
import * as moment from "moment";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  events = [];

  constructor(private menu: MenuController) {
    this.menu.enable(true, "first");
  }

  ngOnInit() {
    this.calendarOptions = {
      height: 650,
      locale: "es",
      defaultView: "agendaWeek",
      header: {
        left: "",
        center: "",
        right: "today prev,next"
      },
      buttonText: {
        today: "Hoy"
      },
      allDaySlot: false,
      minTime: moment.duration("06:00:00"),
      nowIndicator: true,
      editable: true,
      eventLimit: false,
      events: [
        {
          id: "id3",
          title: "Kiana",
          start: "2019-03-12T12:30:00",
          end: "2019-03-12T14:30:00"
        },
        {
          id: "id2",
          title: "Romeo",
          start: "2019-03-13T15:30:00",
          duration: "02:00:00"
        }
      ]
    };
  } // end ngOnInit

  eventClick(event) {
    console.log(event);
  }

  addEvent() {
    const event = {
      id: "added",
      title: "Zack",
      start: "2019-03-14T11:30:00",
      duration: "00:30:00"
    };

    this.ucCalendar.fullCalendar("renderEvent", event);
    this.ucCalendar.fullCalendar("rerenderEvents");
  }
}
