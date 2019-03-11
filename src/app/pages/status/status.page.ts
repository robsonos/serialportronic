import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { SerialPortService } from 'src/app/providers/serial-port/serial-port.service';
import { DataLoggerService } from 'src/app/providers/data-logger/data-logger.service';
import { Data } from 'src/app/interfaces/data';
import { SerialDevice } from 'src/app/interfaces/serial-device';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss']
})
export class StatusPage implements OnInit {
  dataSubscription: Subscription;
  serialDevice: SerialDevice;
  data: Data;
  date: Date;
  loading: any;

  constructor(
    public serialPortService: SerialPortService,
    public dataLoggerService: DataLoggerService,
    public toastController: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
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
    this.dataSubscription = this.serialPortService.dataStream().subscribe(data => {
      // FIXME: is zone needed?
      this.zone.run(async () => {
        let parsedData: Data;
        try {
          parsedData = JSON.parse(data);
          console.log('StatusPage.ionViewDidEnter JSON.parse ', data);
        } catch (error) {
          console.error('StatusPage.ionViewDidEnter JSON.parse ', error);
        }

        if (parsedData.hasOwnProperty('stt')) {
          console.log('StatusPage.ionViewDidEnter JSON.parse valid', parsedData);
          if (this.loading) {
            await this.loading.dismiss();
          }
          this.data = parsedData;
          this.date = new Date();
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
      this.presentLoading(1000);
      this.serialPortService.connect(this.serialDevice).then(
        currentDevice => {
          this.serialDevice = currentDevice;
          console.log('DevicesPage.toggleConnection', currentDevice.isConnected);
          // this.serialDevice.isConnected = true;
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

  toggleCommunication() {
    if (this.serialDevice && this.serialDevice.isConnected) {
      if (this.serialDevice.isCommunicationOn) {
        this.serialPortService.stopCommunication();
        this.presentToast('Communication off');
      } else {
        // TODO: send date
        this.presentLoading(5000);
        this.serialPortService.startCommunication();
        this.presentToast('Communication on');
        this.refreshConsole();
      }
    } else {
      this.presentAlert('Connect to a device first!');
    }
  }

  toggleLog() {
    if (this.serialDevice && this.serialDevice.isConnected) {
      if (this.serialDevice.isCommunicationOn) {
        if (this.data && this.data.stt.log) {
          this.presentLoading(5000);
          this.dataLoggerService.stopDataLogger().then(
            () => {
              this.presentToast('Command sent');
            },
            error => {
              this.presentAlert('Problem sending command: ' + error);
            }
          );
        } else {
          this.presentLoading(5000);
          this.dataLoggerService.startDataLogger().then(
            () => {
              this.presentToast('Command sent');
            },
            error => {
              this.presentAlert('Problem sending command: ' + error);
            }
          );
        }
      } else {
        this.presentAlert('Start communication first!');
      }
    } else {
      this.presentAlert('Connect to a device first!');
    }
  }

  async refreshConsole() {
    if (this.serialDevice && this.serialDevice.isConnected) {
      if (this.serialDevice.isCommunicationOn) {
        this.dataLoggerService.readAllSensors().then(
          () => {
            this.presentToast('Command sent');
          },
          error => {
            this.presentAlert('Problem sending command: ' + error);
          }
        );
      } else {
        this.presentAlert('Start communication first!');
      }
    } else {
      this.presentAlert('Connect to a device first!');
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

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error!',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(time: number) {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: time,
      translucent: true
    });
    await this.loading.present();
  }
}
