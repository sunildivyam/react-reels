import fs from 'fs';
import path from 'path';

// Relative path to project root, from __dirname
const RELATIVE_PATH = '../../../';

function log(message: string, processWrite: boolean = false): void {
  const logFilePath = path.join(__dirname, RELATIVE_PATH, 'public/logs.txt');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  processWrite ? process.stdout.write(message) : console.log(message);
  fs.appendFile(logFilePath, logMessage, (error) => error && console.log('Error in Loger', error));
}

log.clear = () => {
  const logFilePath = path.join(__dirname, RELATIVE_PATH, 'public/logs.txt');
  fs.unlink(logFilePath, (error) => error && console.log('Error deleting log file', error));
}

export default log;
