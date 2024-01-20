import mailgen from "mailgen";
import { mailConfigs } from "../configs/nodeMailer.config.js";
import "dotenv/config";

export const sendInvoiceMail = async (invoice) => {
  // price formatter
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  //import mail configs
  let mailTransporter = mailConfigs();


  let MailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Battery shop name",
      link: "http://localhost:3000/",
      logo: `https://drive.google.com/file/d/14rDrjOsL3Co8bWG2Zu6qNlubbD7OuZSW/view?usp=sharing`,
      logoHeight :'80px'
    },
  });

  //generating table data
  const tableData = invoice.items.map((item) => {
    return {
      Item: item.brand,
      Warranty: item.warranty,
      "Unit price": rupee.format(item.price).toString(),
      Quantity: item.quantity.toString(),
      "Total price": rupee.format(item.totalPrice).toString(),
    };
  });

  var email = {
    body: {
      name: `${invoice.cusName}`,
      intro:
        "We sincerely appreciate your business. Attached is your invoice for purchasing batteries from Sensus hub.Thank you for choosing us, and we look forward to serving you again in the future.",
      table: {
        data: [
          ...tableData,
          {
            Item: "",
            Warranty: "",
            "Unit price": "Discount",
            Quantity: "",
            "Total price": `<b>- ${rupee
              .format(invoice.discount)
              .toString()}</b><br/><hr>`,
          },
          {
            Item: "",
            Warranty: "",
            "Unit price": "Total price",
            Quantity: "",
            "Total price": `<b>${rupee
              .format(invoice.totalSoldPrice)
              .toString()}</b><br/><hr>`,
          },
        ],
        columns: {
          customWidth: {
            Item: "25%",
            Warranty: "12.5%",
            "Unit Price": "25%",
            Quantity: "12.5%",
            "Total Price": "25%",
          },
          customAlignment: {
            "Unit price": "right",
            Quantity: "center",
            "Total price": "right",
          },
        },
      },
      layout: 'full-width',
      outro:
        "Thank you once again for choosing Sensus Hub.We look forward to serving you again in the near future. Have a wonderful day!",
    },
  };

  //convert mailgen body into HTML
  let emailBody = MailGenerator.generate(email);
  let emailText = MailGenerator.generatePlaintext(email);

  //sending credentials
  let details = {
    from: process.env.CLIENT_EMAIL,
    to: `${invoice.cusEmail}`,
    subject: `Battery Invoice`,
    html: emailBody,
    text: emailText,
  };

  //send mail through nodemailer
  await mailTransporter
    .sendMail(details)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
};
