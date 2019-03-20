import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { SerialPortService } from 'src/app/providers/serial-port/serial-port.service';
import { DataLoggerService } from 'src/app/providers/data-logger/data-logger.service';
import { SerialDevice } from 'src/app/interfaces/serial-device';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss']
})
export class StatusPage implements OnInit {
  dataSubscription: Subscription;
  serialDevice: SerialDevice;
  date: Date;
  sentData: any;
  receivedData: any;

  constructor(
    public serialPortService: SerialPortService,
    public dataLoggerService: DataLoggerService,
    public toastController: ToastController,
    private storage: Storage,
    public zone: NgZone
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('StatusPage.ionViewWillEnter');
    // Get connected device
    let connectedDevice: SerialDevice = this.serialPortService.getConnectedDevice();
    if (connectedDevice) {
      console.log('StatusPage.ionViewWillEnter connectedDevice ', connectedDevice);
      this.serialDevice = connectedDevice;
    } else {
      // No devices, either hasn't scanned yet or no devices available. Get last connected device
      this.storage.ready().then(() => {
        this.storage
          .get('lastSerialDevice')
          .then(lastSerialDevice => {
            this.serialDevice = lastSerialDevice;
            console.log('StatusPage.ionViewWillEnter storage ', lastSerialDevice);
          })
          .catch(error => {
            console.error('StatusPage.ionViewWillEnter storage ', error);
          });
      });
    }

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

  toggleConnection() {
    if (this.serialDevice && this.serialDevice.isConnected) {
      // Disconnect
      this.serialPortService.disconnect().then(
        currentDevice => {
          if (this.serialDevice) {
            this.serialDevice = currentDevice;
            console.log('DevicesPage.toggleConnection', currentDevice.isConnected);
            this.presentToast('Disconnected');
            console.log('DevicesPage.toggleConnection disconnect', this.serialDevice);
          }
        },
        error => {
          this.presentToast('Error communicating with device: ' + error);
          console.error('DevicesPage.toggleConnection disconnect: ', error);
        }
      );
    } else {
      // Connect
      this.serialPortService.connect(this.serialDevice).then(
        currentDevice => {
          this.serialDevice = currentDevice;
          this.serialPortService.startCommunication();
          this.presentToast('Connected to ' + this.serialDevice.name);
          console.log('DevicesPage.toggleConnection connect', this.serialDevice);
        },
        error => {
          this.presentToast('Error communicating with ' + this.serialDevice.name + ': ' + error);
          console.error('DevicesPage.toggleConnection connect: ', error);
        }
      );
    }
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
