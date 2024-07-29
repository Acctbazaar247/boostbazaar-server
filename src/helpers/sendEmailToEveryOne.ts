import EmailTemplates from '../shared/EmailTemplates';
import prisma from '../shared/prisma';
import sendEmail from './sendEmail';

const sendEmailToEveryOne = async ({
  accountName,
  category,
  description,
  price,
  without,
}: {
  accountName: string;
  category: string;
  description: string;
  price: number;
  without?: string[];
}) => {
  const allEmail = await prisma.user.findMany({
    where: {
      AND: [
        { shouldSendEmail: true, isVerified: true },
        {
          NOT: {
            email: {
              in: without,
            },
          },
        },
      ],
    },
    select: {
      email: true,
    },
  });
  const allEmailString = allEmail.map(single => single.email);
  await sendEmail(
    { to: 'da', multi: allEmailString },
    {
      subject: EmailTemplates.newAccountAdded.subject,
      html: EmailTemplates.newAccountAdded.html({
        accountName,
        category,
        description,
        price,
      }),
    }
  );
};
export default sendEmailToEveryOne;
