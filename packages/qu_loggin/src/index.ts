import { pino } from 'pino';

function createLogger(appName: string) {
 return pino(pino.destination(`/data/logs/${appName}`));
}

export {
  createLogger
};
