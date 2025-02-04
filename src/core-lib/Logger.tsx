import fs from 'fs';
import path from 'path';

// Relative path to project root, from __dirname
const RELATIVE_PATH = '../../';

function log(message: string, lines: number = 0): void {
  try {
    const logFilePath = path.join(__dirname, RELATIVE_PATH, 'public/logs.txt');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    if (lines) {
      process.stdout.write(message);
      lines > 1 && process.stdout.write(`\x1b[${lines}A`);
    } else {
      console.log(message);
    }

    fs.appendFile(logFilePath, logMessage, (error) => error && console.log('Error Log Append'));
  } catch (error) {

  }

}

log.clear = () => {
  const logFilePath = path.join(__dirname, RELATIVE_PATH, 'public/logs.txt');
  fs.unlink(logFilePath, (error) => error && console.log('Log file already cleared'));
}

export default log;
