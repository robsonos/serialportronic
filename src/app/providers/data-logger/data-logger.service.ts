import { Injectable } from '@angular/core';
import { SerialPortService } from 'src/app/providers/serial-port/serial-port.service';

@Injectable({
  providedIn: 'root'
})
export class DataLoggerService {
  private HEADER: string = '!';

  constructor(public serialPortService: SerialPortService) {}

  public startDataLogger(): Promise<any> {
    return this.enableSensor('0');
  }

  public stopDataLogger(): Promise<any> {
    return this.disableSensor('0');
  }

  private enableSensor(cmd: string): Promise<any> {
    return this.serialPortService.write(this.HEADER + '0' + cmd);
  }

  private disableSensor(cmd: string): Promise<any> {
    return this.serialPortService.write(this.HEADER + '1' + cmd);
  }

  public enableAllSensors() {
    this.serialPortService.write(this.HEADER + '2').then(
      () => {
        console.log('DataLoggerService.enableSensor ', this.HEADER + '2');
      },
      error => {
        console.error('DataLoggerService.enableSensor: ', error);
      }
    );
  }

  public disableAllSensor() {
    this.serialPortService.write(this.HEADER + '3').then(
      () => {
        console.log('DataLoggerService.enableSensor ', this.HEADER + '3');
      },
      error => {
        console.error('DataLoggerService.enableSensor: ', error);
      }
    );
  }

  private readSensor(cmd: string) {
    this.serialPortService.write(this.HEADER + '4' + cmd).then(
      () => {
        console.log('DataLoggerService.enableSensor ', this.HEADER + '4' + cmd);
      },
      error => {
        console.error('DataLoggerService.enableSensor: ', error);
      }
    );
  }

  public readAllSensors(): Promise<any> {
    return this.serialPortService.write(this.HEADER + '6');
  }
}
