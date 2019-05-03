import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Schedule } from '../models/shedule.model';
import { SheduleService } from '../services/shedule/shedule.service';
import { MessagesService } from '../services/messages/messages.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.page.html',
  styleUrls: ['./schedule-detail.page.scss'],
})
export class ScheduleDetailPage implements OnInit {

  @Input() schedule;
  segment = 'Cita';
  uidSchedule: string;
  uidPet: string;
  uidOwner: string;
  scheduleData: any;
  ownerData: any;
  petData: any;
  photos = [];
  oldSchedules = [];


  constructor(
    private modalCtrl: ModalController,
    private sheduleService: SheduleService,
    private messagesService: MessagesService
  ) { }


  ngOnInit() {

    this.uidPet = this.schedule.event.extendedProps.uidPet;
    this.uidOwner = this.schedule.event.extendedProps.uidOwner;
    this.uidSchedule = this.schedule.event.id;
    this.getSchedule();
  }

  getSchedule() {
    this.messagesService.showLoading();
    this.sheduleService.getOneSchedule(this.uidSchedule).then((schedule) => {
      this.scheduleData = schedule;
      this.messagesService.closeLoading();
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
