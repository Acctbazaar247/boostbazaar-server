// import * as OneSignal from 'onesignal-node';
// import { CreateNotificationBody } from 'onesignal-node/lib/types';
// import config from '../config';

// const client = new OneSignal.Client(config.oneSignalID, config.oneSignalApi);

// // Define notification content

// // Send the notification

// const sendPushNotification = async ({ message }: { message: string }) => {
//   const notification: CreateNotificationBody = {
//     contents: {
//       en: message,
//     },
//     // include_player_ids: ['DEVICE_TOKEN_HERE'], // Replace DEVICE_TOKEN_HERE with the device token
//     included_segments: ['All'],
//   };
//   client
//     .createNotification(notification)
//     .then(response => {
//       console.log(response, 'from push');
//     })
//     .catch(error => {
//       console.error(error, 'form push');
//     });
// };
// export default sendPushNotification;
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/messaging';
// import serviceAccount from '../../service_key.json';
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // enable this
  //   admin.initializeApp({
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     credential: admin.credential.cert(serviceAccount as any),
  //   });
}
const sendPushNotification = async ({ message }: { message: string }) => {
  const payload: Message = {
    token:
      'fxWm05ZxRc-Ux4KmlSH2r6:APA91bED_ZHDKmZxoIrHCbMURmMJRqGUa_CtnmD8-qnFB1QbJfoHokuMQhKm9cFuV5zBtOTqeGH71FKcWLXboH-6C3Lb0JXixoFGjdYwP9EGymzRjmiw9BVA1tLLA8FgvCJpRCASWe-I',
    //   'fID-4lfXvNsoxXxo_EjKaV:APA91bHz1127nysNw7w1RYmCn8Bdcly9M7cQew0oPUKKeky57QBFV5HLX94zzLIYRmzt7J4FYQky5477oAtzgf0ap-SGZYPaE33G3L7D84D1RcykyH0X5nk1YEiDBhkx2rxaSi7RSr8e',
    //   'eAiOoBOD-Kql1nl5T2JdE3:APA91bGnnXGtZUe_gik5isNnDmFi5nCcojiWFD-kSTe_5jImgU8MCTMNFrhwVS_6zs5FI-eTGMq0KRuMkOe7H2VOyJg9YVlfDsnXv7okpLlUAuPXRVb2sc-8etVm2g3dFrB6UEr4Phfr',
    //   'chqjGF12aMSWjOSsLZ3lGJ:APA91bGnBcZMsK1AL6_oGhKUs4aeaXKmX7I7ezkb8CKcOdP9bQqqFD0PfYLa78vySgVoVVTF5z4f6bWMvKNFrKN4LQyfJ-X-tbDxD4vvXJbHSzGFd8xSJw0Tdu0DrSxqAQi7-h3vktz_',
    notification: {
      title: 'tor dfda ',
      body: message,
    },
    // webpush: link && {
    //   fcmOptions: {
    //     link,
    //   },
    // },
  };
  await admin.messaging().send(payload);
};
export default sendPushNotification;
