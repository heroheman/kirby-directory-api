const cron = require('node-cron');
import { runCronFetch } from './getItems';

cron.schedule('30 * * * *', () => {
  console.log('⏲️ RUNNING THE CRON');
  runCronFetch();
});
