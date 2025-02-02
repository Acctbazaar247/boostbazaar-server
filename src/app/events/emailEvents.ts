//
import EventEmitter from 'events';
import sendEmail from '../../helpers/sendEmail';
import EmailTemplates from '../../shared/EmailTemplates';

// create events and handle sending email events

const emailEvents = new EventEmitter();

emailEvents.on(
  'send-manual-currency-request-email',
  async (email: string, amount: number) => {
    await sendEmail(
      { to: email },
      {
        subject: EmailTemplates.manualCurrencyRequestApproved.subject,
        html: EmailTemplates.manualCurrencyRequestApproved.html({
          amount: amount,
        }),
      }
    );
  }
);
emailEvents.on(
  'send-manual-currency-request-email-to-admin',
  async (email: string, amount: number) => {
    await sendEmail(
      {
        to: email,
        multi: [
          'brighteghove@gmail.com',
          'ezeokechinwendu@gmail.com',
          'ogbonnajanechinyere@gmail.com',
          //   'naimurrhman53@gmail.com',
        ],
      },
      {
        subject: EmailTemplates.newManualCurrencyRequest.subject,
        html: EmailTemplates.newManualCurrencyRequest.html({
          amount: amount,
          email: email,
        }),
      }
    );
  }
);
export default emailEvents;
