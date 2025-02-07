"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const EmailTemplates = {
    verify: {
        subject: 'Verify for login',
        text: undefined,
        html: (data) => {
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
            background-color: #fff;
            color: #000 !important;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-y: auto;
        }

        .container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-box {
            background-color: #fff;
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

        .title{
            font-size: 23px;
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
            background-color: rgb(0, 110, 255);
            border-radius: 50%;
            padding: 10px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: rgb(0, 110, 255);
            border-radius: 10px;
            outline: none;
            border: 1px solid rgb(0, 110, 255);
            text-decoration: none; /* Use this for <a> based buttons */
        }

        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }

        .end a {
            color: grey;
            font-weight: 600;
            text-decoration: none;
        }

        .course-image {
            width: 100%;
            height: auto;
            max-width: 100%;
            margin: 20px 0;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h2 style="display: inline; font-size: 25px; margin: 0; padding-left: 10px;">Acctpanel</h2>
                    </td>
                </tr>
            </table>
            <h2 class="title">Verify Your Account</h2>
            <p>Welcome to AcctPanel! We're thrilled to have you on board. <br> Your account has been successfully created. To access it, please use the code provided below.</p>
            <div class="email-box-content">
                <a href="" class="btn">${data === null || data === void 0 ? void 0 : data.token}</a>
                <p class="end">
                    This is an automatically generated email. Please do not reply to this email. 
                    If you face any issues, please contact us at <a href="mailto:support@acctpanel.com">support@acctpanel.com</a>.
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="https://www.instagram.com/acctpanel/"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Acctpanel.</p>
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
        html: (data) => {
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
        html: (data) => {
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
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>
        `;
        },
    },
    sellerRequest: {
        subject: 'New User Requested For Seller',
        html: (data) => `
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
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
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
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
    orderSuccessful: {
        subject: 'You have purchase a new service',
        html: () => `
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
            background-color: #fff;
            color: #000 !important;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-y: auto;
        }

        .container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-box {
            background-color: #fff;
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

        .title{
            font-size: 23px;
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
            background-color: rgb(0, 110, 255);
            border-radius: 50%;
            padding: 10px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: rgb(0, 110, 255);
            border-radius: 10px;
            outline: none;
            border: 1px solid rgb(0, 110, 255);
            text-decoration: none; /* Use this for <a> based buttons */
        }

        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }

        .end a {
            color: grey;
            font-weight: 600;
            text-decoration: none;
        }

        .course-image {
            width: 100%;
            height: auto;
            max-width: 100%;
            margin: 20px 0;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h2 style="display: inline; font-size: 25px; margin: 0; padding-left: 10px;">Acctpanel</h2>
                    </td>
                </tr>
            </table>
            <h2 class="title">Congratulations!</h2>
            <!-- <img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722718801/la4nkevwu2o9twru9msj.png" alt="Course Image" class="course-image"> -->
            <p> Congratulation you’ve purchase a service, login to see the activity. 
</p>
            <div class="email-box-content">
                <a href="${config_1.default.frontendUrl}" class="btn">Visit</a>
                <p class="end">
                    This is an automatically generated email. Please do not reply to this email. 
                    If you face any issues, please contact us at <a href="support@acctpanel.com">support@acctpanel.com</a>.
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="https://www.instagram.com/acctpanelcom"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                    <span><a href="https://x.com/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720231/pubaatf2xdnmyglvskuo.png" alt=""></a></span>
                    <span><a href="https://www.tiktok.com/@acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1730188449/f9nohvfpcwg9l5ekyrii.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Acctpanel.</p>
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
        html: (data) => `
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
                            <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                            <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                        </td>
                    </tr>
                </table>
                <h2 class="title">You have new message</h2>
                <p>A new message for ${data.productName} from ${data.from} </p>
                <div class="email-box-content">
                    <a href="${config_1.default.frontendUrl}" class="btn">View</a>
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
        html: (data) => `
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
                            <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                            <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                        </td>
                    </tr>
                </table>
                <h2 class="title">Discover Latest Accounts</h2>
                <p>Dive into our latest treasures! Sign into your account and discover what's new.</p>
                <div class="email-box-content">
                    <a href="${config_1.default.frontendUrl}" class="btn">View</a>
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
        subject: 'Successfully payment is complete for currency but did not save data',
        html: (data) => `
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
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
    sendReferral: {
        html: (data) => ` 
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
            background-color: #fff;
            color: #000 !important;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-y: auto;
        }

        .container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-box {
            background-color: #fff;
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

        .title{
            font-size: 23px;
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
            background-color: rgb(0, 110, 255);
            border-radius: 50%;
            padding: 10px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: rgb(0, 110, 255);
            border-radius: 10px;
            outline: none;
            border: 1px solid rgb(0, 110, 255);
            text-decoration: none; /* Use this for <a> based buttons */
        }

        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }

        .end a {
            color: grey;
            font-weight: 600;
            text-decoration: none;
        }

        .course-image {
            width: 100%;
            height: auto;
            max-width: 100%;
            margin: 20px 0;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h2 style="display: inline; font-size: 25px; margin: 0; padding-left: 10px;">Acctpanel</h2>
                    </td>
                </tr>
            </table>
            <h2 class="title">Hi There!</h2>
            <p>Welcome to AcctPanel! Enhance your social media presence effortlessly. 
                Acctpanel offers powerful tools and services to help your online following, 
                engage with your audience, and achieve your digital marketing goals.</p>
            <div class="email-box-content">
                <a href="${config_1.default.frontendUrl + data.link}" class="btn">Visit</a>
                <p class="end">
                    This is an automatically generated email. Please do not reply to this email. 
                    If you face any issues, please contact us at <a href="mailto:support@acctpanel.com">support@acctpanel.com</a>.
                </p>
                <hr>
                <div class="social-icons">
                 <span><a href="https://www.instagram.com/acctpanelcom"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                    <span><a href="https://x.com/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720231/pubaatf2xdnmyglvskuo.png" alt=""></a></span>
                    <span><a href="https://www.tiktok.com/@acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1730188449/f9nohvfpcwg9l5ekyrii.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Acctpanel.</p>
            </div>
        </div>
    </div>
</body>
</html>
    
    `,
    },
    manualCurrencyRequestApproved: {
        subject: 'Your manual payment request is approved',
        html: (data) => {
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

        /* Adjust styles for mobile screens */
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
            width: 24px; /* Decrease width */
            height: 24px; /* Decrease height */
            border-radius: 50%;
            padding: 5px; /* Decrease padding */
            text-align: center;
            line-height: 24px;
        }

        .social-icons span a img {
            width: 12px; 
            height: 12px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
            font-size: 16px; 
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
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctpanel</h3>
                    </td>
                </tr>
            </table>
            <h2 class="title">Your Wallet has been funded</h2>
            <p>
              Your Manual Payment is approved and your wallet is funded $${data.amount}
            </p>
            <div class="email-box-content">
                <a href="${config_1.default.frontendUrl}" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@acctpanel.com
                </p>
                <hr>
                <div class="social-icons">
                     <span><a href="https://www.instagram.com/acctpanelcom"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                    <span><a href="https://x.com/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720231/pubaatf2xdnmyglvskuo.png" alt=""></a></span>
                    <span><a href="https://www.tiktok.com/@acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1730188449/f9nohvfpcwg9l5ekyrii.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2025 Acctpanel Ltd.</p>
            </div>
        </div>
    </div>
</body>
</html>
      
      `;
        },
    },
    newManualCurrencyRequest: {
        subject: 'New manual currency request on Acctpanel',
        html: (data) => {
            return `
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

        /* Adjust styles for mobile screens */
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
            width: 24px; /* Decrease width */
            height: 24px; /* Decrease height */
            border-radius: 50%;
            padding: 5px; /* Decrease padding */
            text-align: center;
            line-height: 24px;
        }

        .social-icons span a img {
            width: 12px; 
            height: 12px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
            font-size: 16px; 
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
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctpanel</h3>
                    </td>
                </tr>
            </table>
            <h2 class="title">New Manual Deposit</h2>
            <p>
                Hi there, <br>
                A new user ${data.email} has just made manual deposit to Acctpanel.
            </p>
            <div class="email-box-content">
                <a href="#" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@acctpanel.com
                </p>
                <hr>
                <div class="social-icons">
                     <span><a href="https://www.instagram.com/acctpanelcom"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                    <span><a href="https://x.com/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720231/pubaatf2xdnmyglvskuo.png" alt=""></a></span>
                    <span><a href="https://www.tiktok.com/@acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1730188449/f9nohvfpcwg9l5ekyrii.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2025 Acctpanel Ltd.</p>
            </div>
        </div>
    </div>
</body>
</html>
      `;
        },
    },
    reCheckSmsPoolOrder: {
        subject: 'Re-check sms pool order',
        html: (data) => {
            return `
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

        /* Adjust styles for mobile screens */
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
            width: 24px; /* Decrease width */
            height: 24px; /* Decrease height */
            border-radius: 50%;
            padding: 5px; /* Decrease padding */
            text-align: center;
            line-height: 24px;
        }

        .social-icons span a img {
            width: 12px; 
            height: 12px;
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
            font-size: 16px; 
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
                        <img src="${config_1.default.mainLogo}" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctpanel</h3>
                    </td>
                </tr>
            </table>
            <h2 class="title">Re-check sms pool order</h2>
            <p>
                Hi Admin <br>
                A sms pool order ${data.orderId} made by ${data.email} need's to re-checked because its successFully made a request to sms pool. but not found in our database.
            </p>
            <div class="email-box-content">
                <a href="#" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@acctpanel.com
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="https://www.instagram.com/acctpanelcom"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720542/zwecb4fjxxzxfudqmmmt.png" alt=""></a></span>
                    <span><a href="https://t.me/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720920/yrrzkbbjjddmm34hotp4.png" alt=""></a></span>
                    <span><a href="https://x.com/acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1722720231/pubaatf2xdnmyglvskuo.png" alt=""></a></span>
                    <span><a href="https://www.tiktok.com/@acctpanel"><img src="https://res.cloudinary.com/dfyeocma8/image/upload/v1730188449/f9nohvfpcwg9l5ekyrii.png" alt=""></a></span>
                </div>
                <p class="end">Copyright &copy; 2025 Acctpanel Ltd.</p>
            </div>
        </div>
    </div>
</body>
</html>
      `;
        },
    },
};
exports.default = EmailTemplates;
