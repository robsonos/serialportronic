import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Status',
      url: '/status',
      icon: 'pulse'
    },
    {
      title: 'Devices',
      url: '/devices',
      icon: 'desktop'
    }
  ];
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Do something
    });
  }
}
