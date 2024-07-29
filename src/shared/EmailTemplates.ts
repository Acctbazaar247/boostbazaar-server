import config from '../config';
type IHtmlData = {
  token?: number;
  userName?: string;
  userEmail?: string;
  userProfileImg?: string;
  txId?: string | null;
  amount?: string | number;
  currencyAmount?: string | number;
  currentAmount?: string | number;
  accountUserName?: string;
  accountPassword?: string;
  accountName?: string;
  failedSavedData?: string;
};
const EmailTemplates = {
  verify: {
    subject: 'Verify for login',
    text: undefined,
    html: (data: IHtmlData) => {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #000 !important;
                  font-family: Arial, sans-serif;
              }
      
              .email-box {
                  background-color: white;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  max-width: 400px;
                  width: 100%;
                  margin: 0 auto; 
              }
      
               /* mobile screens */
               @media (max-width: 768px) {
                  .email-box {
                      max-width: 300px; 
                  }
              }
      
              .title, p {
                  text-align: center;
              }
      
              .social-icons {
                  text-align: center;
                  margin: 20px 0; 
                  color: white;
              }
      
              .social-icons span {
                  margin: 0 10px; 
                  display: inline-block;
                  background-color: rgb(255, 85, 0);
                  border-radius: 50%;
                  padding: 10px; 
              }
      
              .social-icons span a{
                  color: #fff;
                  text-decoration: none;
              }
      
              .account-name {
                  font-weight: 700;
                  font-size: 20px;
                  padding-bottom: 10px;
              }
      
              .btn {
                  display: block;
                  width: fit-content;
                  padding: 12px 40px;
                  margin: 30px auto;
                  background-color: transparent;
                  color: rgb(255, 85, 0);
                  border-radius: 10px;
                  outline: none;
                  border: 1px solid rgb(255, 85, 0);
                  text-decoration: none;
              }
              
              .end {
                  font-size: 14px;
                  color: grey !important;
                  padding-top: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="email-box">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                      <tr>
                          <td style="text-align: center;">
                              <img src="${config.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                              <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                          </td>
                      </tr>
                  </table>
                  <h2 class="title">Verify Your Account</h2> <br>
                  <h3>Hi there,</h3>
                  <p>Welcome to Acctbazaar, Your Premier P2P Marketplace for Social Media Accounts.</p>
                  <div class="email-box-content">
                ${data?.token}
                      <p class="end">
                          This is an automatically generated email please do not reply to this email. 
                          If you face any issues, please contact us at help@acctbazaar.com
                      </p>
                     
                      <p class="end">Copyright &copy; 2024 Acctbazaar Ltd.</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
        `;
    },
  },
  requestForCurrencyToAdmin: {
    subject: 'Requested To Buy Currency',
    html: (data: IHtmlData) => {
      return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Currency Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .profile-container {
      text-align: center;
      margin-top: 2rem;
    }

    .profile-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
    }

    .profile-info {
      margin-top: 1rem;
    }

    .profile-name {
      font-weight: bold;
      font-size: 18px;
    }

    .profile-email {
      font-size: 14px;
    }

    .button-container {
      margin-top: 1rem;
    }

    .check-request-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.userName} requested for currency for ${data.amount} </h1>
    </div>
    <div class="profile-container">
      <img src="${data.userProfileImg}" alt="Profile" class="profile-image">
      <div class="profile-info">
        <h1 class="profile-name">${data.userName} </h1>
        <span class="profile-email">${data.userEmail} </span>
      </div>
      <div class="button-container">
        <a href="#" style="color:#fff" class="check-request-button">Check Request</a>
      </div>
    </div>
  </div>
</body>
</html>

        `;
    },
  },
  confirmEmailForCurrencyPurchase: {
    subject: 'Successfully Purchased Currency',
    html: (data: IHtmlData) => {
      return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .purchase-info {
      margin-top: 5px;
    }

    .currency-amount,
    .current-currency {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank you!</h1>
    </div>
    <div class="content">
      <p class="purchase-info">
        You have successfully purchased
        <span class="currency-amount">${data.currencyAmount} currency</span> 
      </p>
      <p class="current-currency">
        Your current currency is <span>${data.currentAmount}</span>
      </p>
      <a href="${config.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>
        `;
    },
  },
  sellerRequest: {
    subject: 'New User Requested For Seller',
    html: (data: IHtmlData) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Seller Requested</h1>
    </div>
    <div class="content">
      <p class="seller-info">
        ${data.userEmail} wants to become a seller
      </p>
      <p class="transaction-id">
        The transaction Id is <span>${data.txId}</span>
      </p>
      <a href="${config.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
  },
  sellerRequestAccepted: {
    subject: 'You are now a seller in Acctbazaar',
    html: () => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You have successfully become a seller </h1>
    </div>
    <div class="content">
      <p class="seller-info">
       You can now publish accounts for sale
      </p> 
      <a href="${config.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
  },
  orderSuccessful: {
    subject: 'You have purchase a order',
    html: (data: IHtmlData) => `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #000 !important;
            font-family: Arial, sans-serif;
        }

        .email-box {
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 400px; /* Default max-width for larger devices */
            width: 100%;
            margin: 0 auto;
        }

        /* Adjust styles for mobile screens */
        @media (max-width: 768px) {
            .email-box {
                max-width: 300px; /* Smaller max-width for mobile screens */
            }
        }

        .title, p {
            text-align: center;
        }

        .box-row {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 10px;
            margin-top: 20px;
        }

        .account-name {
            font-weight: 700;
            font-size: 20px;
            padding-bottom: 10px;
        }

        .social-icons {
            text-align: center;
            margin: 20px 0; 
            color: white;
        }

        .social-icons span {
            margin: 0 10px; 
            display: inline-block;
            background-color: rgb(255, 85, 0);
            border-radius: 50%;
            padding: 10px; 
        }

        .social-icons span a{
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: rgb(255, 85, 0);
            border-radius: 10px;
            outline: none;
            border: 1px solid rgb(255, 85, 0);
            text-decoration: none;
        }
        
        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                    </td>
                </tr>
            </table>
            <h2 class="title">Congratulations!</h2>
            <p>You successfully purchased ${data.accountName}.</p>
            <div class="email-box-content">
                <a href="${config.frontendUrl}/dashboard/myOrders" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at help@acctbazaar.com
                </p>
                <hr>
               
                <p class="end">Copyright &copy; 2024 Acctbazaar Ltd.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
  },
  sendAMessage: {
    subject: 'You have a new message.',
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    html: (data: { from: string; productName: string }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #000 !important;
                font-family: Arial, sans-serif;
            }
    
            .email-box {
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                max-width: 400px;
                width: 100%;
                margin: 0 auto; 
                /* border: 1px solid  #000; */
            }
    
             /* mobile screens */
             @media (max-width: 768px) {
                .email-box {
                    max-width: 300px; 
                }
            }
    
            .title, p {
                text-align: center;
            }
    
            .box-row {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 10px;
                margin-top: 20px;
            }
    
            .account-name {
                font-weight: 700;
                font-size: 20px;
                padding-bottom: 10px;
            }
    
            .social-icons {
                text-align: center;
                margin: 20px 0; 
                color: white;
            }
    
            .social-icons span {
                margin: 0 10px; 
                display: inline-block;
                background-color: rgb(255, 85, 0);
                border-radius: 50%;
                padding: 10px; 
            }
    
            .social-icons span a{
                color: #fff;
                text-decoration: none;
            }
    
    
            .btn {
                display: block;
                width: fit-content;
                padding: 12px 40px;
                margin: 30px auto;
                background-color: transparent;
                color: rgb(255, 85, 0);
                border-radius: 10px;
                outline: none;
                border: 1px solid rgb(255, 85, 0);
                text-decoration: none; /* Use this for <a> based buttons */
            }
            
            .end {
                font-size: 14px;
                color: grey !important;
                padding-top: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-box">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                    <tr>
                        <td style="text-align: center;">
                            <img src="${config.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                            <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                        </td>
                    </tr>
                </table>
                <h2 class="title">You have new message</h2>
                <p>A new message for ${data.productName} from ${data.from} </p>
                <div class="email-box-content">
                    <a href="${config.frontendUrl}" class="btn">View</a>
                    <p class="end">
                        This is an automatically generated email please do not reply to this email. 
                        If you face any issues, please contact us at help@acctbazaar.com
                    </p>
                    <hr> 
                    <p class="end">Copyright &copy; 2024 Acctbazaar Ltd.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `,
  },
  newAccountAdded: {
    subject: 'New account added on Acctbazaar ',
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    html: (data: {
      accountName: string;
      category: string;
      price: number;
      description: string;
    }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #000 !important;
                font-family: Arial, sans-serif;
            }
    
            .email-box {
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                max-width: 400px;
                width: 100%;
                margin: 0 auto; 
                /* border: 1px solid  #000; */
            }
    
             /* mobile screens */
             @media (max-width: 768px) {
                .email-box {
                    max-width: 300px; 
                }
            }
    
            .title, p {
                text-align: center;
            }
    
            .box-row {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 10px;
                margin-top: 20px;
            }
    
            .account-name {
                font-weight: 700;
                font-size: 20px;
                padding-bottom: 10px;
            }
    
            .social-icons {
                text-align: center;
                margin: 20px 0; 
                color: white;
            }
    
            .social-icons span {
                margin: 0 10px; 
                display: inline-block;
                background-color: rgb(255, 85, 0);
                border-radius: 50%;
                padding: 10px; 
            }
    
            .social-icons span a{
                color: #fff;
                text-decoration: none;
            }
    
    
            .btn {
                display: block;
                width: fit-content;
                padding: 12px 40px;
                margin: 30px auto;
                background-color: transparent;
                color: rgb(255, 85, 0);
                border-radius: 10px;
                outline: none;
                border: 1px solid rgb(255, 85, 0);
                text-decoration: none; /* Use this for <a> based buttons */
            }
            
            .end {
                font-size: 14px;
                color: grey !important;
                padding-top: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-box">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                    <tr>
                        <td style="text-align: center;">
                            <img src="${config.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                            <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                        </td>
                    </tr>
                </table>
                <h2 class="title">Discover Latest Accounts</h2>
                <p>Dive into our latest treasures! Sign into your account and discover what's new.</p>
                <div class="email-box-content">
                    <a href="${config.frontendUrl}" class="btn">View</a>
                    <p class="end">
                        This is an automatically generated email please do not reply to this email. 
                        If you face any issues, please contact us at help@acctbazaar.com
                    </p>
                    <hr> 
                    <p class="end">Copyright &copy; 2024 Acctbazaar Ltd.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `,
  },
  currencyRequestPaymentSuccessButFailed: {
    subject:
      'Successfully payment is complete for currency but did not save data',
    html: (data: IHtmlData) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SomeThing went wrong while saving paid currency info Here is the order info  </h1>
    </div>  
    <div class="content">
      <p class="seller-info">
      
      ${data.failedSavedData}
      </p>  
      <a href="${config.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
  },
};
export default EmailTemplates;
