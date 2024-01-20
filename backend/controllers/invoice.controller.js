import Battery from "../models/battery.model.js";
import Invoice from "../models/invoice.model.js";
import {sendInvoiceMail} from "../Mails/customer.mails.js";

//generate Invoice Id
const generateInvoiceId = async () => {
  //get last stock object, if there is a battery, then return that battery object, otherwise return empty array
  const lastInvoiceDetails = await Invoice.find().sort({ _id: -1 }).limit(1);

  //check if the result array is empty or not, if its empty then return first invoice ID
  if (lastInvoiceDetails.length == 0) {
    return "INVC-1";
  }

  //if array is not null, last get last invoice Id
  const invoiceId = lastInvoiceDetails.map((data) => {
    return data.invoice_id;
  });

  //then we get the Integer value from the last part of the ID
  const oldInvoiceId = parseInt(invoiceId[0].split("-")[1]);

  const newInvoiceId = oldInvoiceId + 1; //then we add 1 to the past value

  return `INVC-${newInvoiceId}`; //return new invoice ID
};

export const addInvoice = async (req, res) => {

  // generate the custom Invoice Id
  const customInvoiceID = await generateInvoiceId();

  //console.log(req.body);
  try {
    // create the Invoice Object
    const invoice = new Invoice({
      issuedDate: req.body.issuedDate,
      invoice_id: customInvoiceID,
      cusName: req.body.cusName,
      cusPhone: req.body.cusPhone,
      cusEmail : req.body.cusEmail,
      cusAddress: req.body.cusAddress,
      items: req.body.items,
      discount: req.body.discount,
      totalActualPrice: req.body.totalActualPrice,
      totalSoldPrice: req.body.totalSoldPrice,
    });
    
    // store the invoice Object in the datasase
    const savedInvoice = await invoice.save();


    // after saving the invoice, send the invoice via email to the customer, if email mentioned
    if(req.body.cusEmail.length > 0){

      console.log(`Sending mail to ${invoice.cusEmail}....`)
      // mentioned here your sending email function
      sendInvoiceMail(invoice)

    }

    // reduce the quantities 
    const items = req.body.items;
    
    //updating stocks
    const updatedStocks = items.map((item) =>{
      Battery.findById({_id : item._id}).then((data)=>{
        return Battery.findByIdAndUpdate({_id : data._id},{quantity : data.quantity - parseInt(item.quantity)},{new : true});
      })
    });

    // send The success status to the frontend
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ error: error, message: "Invoice saved failed!" }); //if anything went wrong this error response will forwarded
  }
};

// get all invoices
export const getAllInvocies = async (req, res) => {
  try {
    // get invoices data
    const invoices = await Invoice.find();

    // return data
    if (invoices.length === 0) {
      res.status(204).json(invoices);
    } else {
      res.status(200).json(invoices);
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Invoice fetching error" });
  }
};


