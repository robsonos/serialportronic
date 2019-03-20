import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SerialPortService } from 'src/app/providers/serial-port/serial-port.service';
import { SerialDevice } from 'src/app/interfaces/serial-device';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss']
})
export class StatusPage implements OnInit {
  dataSubscription: Subscription;
  serialDevice: SerialDevice;
  serialDevices: SerialDevice[];
  date: Date;
  sentData: any;
  receivedData: any;

  constructor(public serialPortService: SerialPortService, public toastController: ToastController, public zone: NgZone) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('StatusPage.ionViewWillEnter');

    // Start listening to stream
    this.dataSubscription = this.serialPortService.dataStream().subscribe(receivedData => {
      this.zone.run(() => {
        try {
          // let json = JSON.stringify(receivedData);
          // let bufferOriginal = Buffer.from(JSON.parse(json).data);
          // this.receivedData = bufferOriginal.toString('utf8');
          this.receivedData = receivedData;
          this.date = new Date();

          console.log('StatusPage.ionViewDidEnter JSON.parse ', receivedData);
        } catch (error) {
          console.error('StatusPage.ionViewDidEnter JSON.parse ', error);
        }
      });
    });
  }

  ionViewWillLeave() {
    // Stop listening to stream
    this.dataSubscription.unsubscribe();
  }

  toggleConnection(serialDevice: SerialDevice) {
    if (this.serialPortService.isConnected() && this.serialDevices.find(dev => dev.name === serialDevice.name).isConnected) {
      // Disconnect
      this.serialPortService.disconnect().then(
        currentDevice => {
          if (this.serialDevice) {
            this.serialDevice = currentDevice;
            this.presentToast('Disconnected');
            console.log('StatusPage.toggleConnection disconnect', this.serialDevices);
          }
        },
        error => {
          this.presentToast('Error communicating with device: ' + error);
          console.error('StatusPage.toggleConnection disconnect: ', error);
        }
      );
    } else {
      // Connect
      this.serialPortService.connect(serialDevice).then(
        currentDevice => {
          this.serialDevice = currentDevice;
          this.presentToast('Connected to ' + serialDevice.name);
          console.log('StatusPage.toggleConnection connect', this.serialDevices);
        },
        error => {
          this.presentToast('Error communicating with ' + serialDevice.name + ': ' + error);
          console.error('StatusPage.toggleConnection connect: ', error);
        }
      );
    }
  }

  scan() {
    this.serialPortService.scan().then(
      scannedDevices => {
        this.serialDevices = scannedDevices;
        console.log('StatusPage.scan scan: ', this.serialDevices);
      },
      error => {
        this.presentToast('Error communicating with device: ' + error);
        console.error('StatusPage.scan scan: ', error);
      }
    );
  }

  sendData() {
    this.serialPortService.write(this.sentData).then(() => {
      this.presentToast('Data sent');
    });
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
