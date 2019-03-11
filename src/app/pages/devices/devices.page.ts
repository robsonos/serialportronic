import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SerialPortService } from 'src/app/providers/serial-port/serial-port.service';
import { SerialDevice } from 'src/app/interfaces/serial-device';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss']
})
export class DevicesPage implements OnInit {
  serialDevices: SerialDevice[];

  constructor(public serialPortService: SerialPortService, public toastController: ToastController) {
    console.log('DevicesPage.constructor');
    this.serialDevices = this.serialPortService.getDevices();
  }

  ngOnInit() {}

  scan() {
    this.serialPortService.scan().then(
      scannedDevices => {
        this.serialDevices = scannedDevices;
        console.log('DevicesPage.scan scan: ', this.serialDevices);
      },
      error => {
        this.presentToast('Error communicating with device: ' + error);
        console.error('DevicesPage.scan scan: ', error);
      }
    );
  }

  toggleConnection(serialDevice: SerialDevice) {
    if (this.serialPortService.isConnected() && this.serialDevices.find(dev => dev.name === serialDevice.name).isConnected) {
      // Disconnect
      this.serialPortService.disconnect().then(
        () => {
          if (this.serialDevices) {
            this.serialDevices = this.serialPortService.getDevices();
            this.presentToast('Disconnected');
            console.log('DevicesPage.toggleConnection disconnect', this.serialDevices);
          }
        },
        error => {
          this.presentToast('Error communicating with device: ' + error);
          console.error('DevicesPage.toggleConnection disconnect: ', error);
        }
      );
    } else {
      // Connect
      this.serialPortService.connect(serialDevice).then(
        () => {
          this.serialDevices = this.serialPortService.getDevices();
          this.presentToast('Connected to ' + serialDevice.name);
          console.log('DevicesPage.toggleConnection connect', this.serialDevices);
        },
        error => {
          this.presentToast('Error communicating with ' + serialDevice.name + ': ' + error);
          console.error('DevicesPage.toggleConnection connect: ', error);
        }
      );
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      showCloseButton: true
    });
    await toast.present();
  }
}
