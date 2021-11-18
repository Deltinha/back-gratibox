import './setup';
import app from './app.js';

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `Server exiting due to an unhandled promise rejection: ${promise} and reason ${reason}`
  );
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error('Server exiting due to uncaught exception', error);
});

let port = process.env.PORT;

if (process.env.NODE_ENV === 'dev') {
  port = 4000;
}

if (process.env.NODE_ENV === 'test') {
  port = 4001;
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
