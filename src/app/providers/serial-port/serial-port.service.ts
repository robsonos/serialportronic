import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as SerialPort from 'serialport';
import { Subject, Observable } from 'rxjs';
import { SerialDevice } from 'src/app/interfaces/serial-device';

@Injectable({
  providedIn: 'root'
})
export class SerialPortService {
  private serialPortManager: typeof SerialPort;
  private serialPort: SerialPort;
  private devices: SerialDevice[];
  private currentDevice: SerialDevice;
  private data: Subject<any>;

  constructor(private storage: Storage) {
    console.log('SerialPortService.constructor');
    // Check if platform is electron and force serialport to load
    if (window && window['process'] && window['process'].type) {
      console.log('SerialPortService.constructor electron');
      this.serialPortManager = window['require']('serialport');
    }
    this.data = new Subject<any>();
  }

  public scan(): Promise<SerialDevice[]> {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        // Port is connected
        this.disconnect().then(
          () => this._scan().then(scannedDevices => resolve(scannedDevices), error => reject(error)),
          error => reject(error)
        );
      } else {
        this._scan().then(scannedDevices => resolve(scannedDevices), error => reject(error));
      }
    });
  }

  private _scan(): Promise<SerialDevice[]> {
    return new Promise((resolve, reject) => {
      this.serialPortManager.list().then(
        serialDevices => {
          this.devices = [];
          let index = 0;

          serialDevices.forEach(serialDevice => {
            let tempPort: SerialDevice = {
              id: index,
              name: serialDevice.comName,
              manufacturer: serialDevice.manufacturer,
              vendorId: serialDevice.vendorId,
              productId: serialDevice.productId,
              isConnected: false
            };

            this.devices.push(tempPort);
            index++;
          });

          resolve(this.devices);
        },
        error => reject(error)
      );
    });
  }

  public connect(serialDevice: SerialDevice): Promise<SerialDevice> {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        // Port is connected
        this.disconnect().then(
          () => this._connect(serialDevice).then(currentDevice => resolve(currentDevice), error => reject(error)),
          error => reject(error)
        );
      } else {
        this._connect(serialDevice).then(currentDevice => resolve(currentDevice), error => reject(error));
      }
    });
  }

  private _connect(serialDevice: SerialDevice): Promise<SerialDevice> {
    return new Promise((resolve, reject) => {
      this.serialPort = new this.serialPortManager(serialDevice.name, { baudRate: 115200, autoOpen: false });

      this.serialPort.on('open', () => {
        this.currentDevice = serialDevice;
        this.currentDevice.isConnected = true;

        this.storage
          .ready()
          .then(() => {
            let lastSerialDevice: SerialDevice = {
              id: this.currentDevice.id,
              name: this.currentDevice.name,
              isConnected: false
            };

            this.storage.set('lastSerialDevice', lastSerialDevice).then(() => {
              console.log('SerialPortService.connect serialPort.on.open storage saved', lastSerialDevice);
              if (this.devices) {
                this.devices.find(dev => dev.name === serialDevice.name).isConnected = true;
              }
              console.log('SerialPortService._connect kk', this.currentDevice.isConnected);
              resolve(this.currentDevice);
            });
          })
          .catch(error => {
            console.error('SerialPortService._connect kk', this.currentDevice.isConnected);
            // Resolve even if storage fails
            console.error('SerialPortService.connect serialPort.on.open storage:', error);
            // resolve(this.currentDevice);
          });
      });

      this.serialPort.pipe(new this.serialPortManager.parsers.Readline({ delimiter: '\n' })).on('data', data => {
        console.log('SerialPortService.connect serialPort.on.data', data);
        this.data.next(data);
      });

      this.serialPort.open(error => {
        if (error) {
          console.error('SerialPortService.connect serialPort.open: ', error);
          reject(error);
        }
      });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        if (this.devices) {
          this.devices.forEach(dev => {
            dev.isConnected = false;
          });
        }

        this.currentDevice.isConnected = false;

        this.serialPort.on('close', () => {
          console.log('SerialPortService.disconnect serialPort.on.close');
          this.serialPort = null;
          resolve(this.currentDevice);
        });

        this.serialPort.close(error => {
          if (error) {
            console.error('SerialPortService.disconnect: ', error);
            reject(error);
          }
        });
      } else {
        reject('Error: Closing port: Port already closed!');
      }
    });
  }

  public isConnected(): boolean {
    return this.serialPort ? this.serialPort.isOpen : false;
  }

  public dataStream(): Observable<any> {
    return this.data;
  }

  public write(cmd: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.serialPort.write(cmd + '\n', error => {
        if (error) {
          console.error('SerialPortService.write write: ', error);
          reject(error);
        }
      });

      this.serialPort.drain(() => {
        console.log('SerialPortService.write drain');
        resolve();
      });
    });
  }
}
