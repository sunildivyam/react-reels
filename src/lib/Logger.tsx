import fs from 'fs';
import path from 'path';

class Logger {
  private logFilePath: string;

  constructor() {
    this.logFilePath = path.join(__dirname, '../../public/logs.txt');
  }

  log(message: string, processWrite: boolean = false): void {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    processWrite ? process.rawListeners(message) : console.log(message);
    fs.appendFile(this.logFilePath, logMessage, (error) => console.log('Error in Loger', error));
  }
}

export default new Logger().log;
