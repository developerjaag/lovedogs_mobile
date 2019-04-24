import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.page.html',
  styleUrls: ['./schedule-detail.page.scss'],
})
export class ScheduleDetailPage implements OnInit {

  @Input() schedule;
  segment = 'Cita';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.schedule);

  }

  close() {
    this.modalCtrl.dismiss();
  }

}
