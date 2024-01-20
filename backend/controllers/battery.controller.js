import Battery from "../models/battery.model.js";

//generate Stock Id
const generateStockId = async () => {
  //get last stock object, if there is a battery, then return that battery object, otherwise return empty array
  const lastStockDetails = await Battery.find().sort({ _id: -1,"isDeleted.count": 0 }).limit(1);

  //check if the result array is empty or not, if its empty then return first stock ID
  if (lastStockDetails.length == 0) {
    return "STK-1";
  }

  //if array is not null, last get last stock Id
  const stockId = lastStockDetails.map((data) => {
    return data.stock_id;
  });

  //then we get the Integer value from the last part of the ID
  const oldStockId = parseInt(stockId[0].split("-")[1]);

  const newStockId = oldStockId + 1; //then we add 1 to the past value

  return  `STK-${newStockId}`;//return new Stock ID
};

//get all added data
export const getAllItems = async (req, res) => {
  try {
    const batteries = await Battery.find({ "isDeleted.count": 0,status:"ACCEPTED" }); // Retrieve all battery (not deleted by worker or admin) documents from the database

    res.status(200).json(batteries); // Send the batteries as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batteries", error });
  }
};

//add items to the db
export const addBatteries = async (req, res) => {
  try {

    //generate Stock ID
    const customStockId = await generateStockId();

    const newBattery = new Battery({
      stock_id: customStockId,
      quantity: req.body.quantity,
      added_date: req.body.added_date,
      warranty: req.body.warnty_priod,
      sellingPrice: req.body.sellingPrice,
      actualPrice: req.body.actualPrice,
      batteryBrand: req.body.batry_brand,
      batteryDescription: req.body.Battery_description,
    });

    const savedBattery = await newBattery.save(); // Save the new battery document to the database

    console.log(savedBattery);

    res.status(201).json(savedBattery); // Send the saved battery as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to add battery", error });
  }
};

//delete battery
export const deleteBattery = async (req, res) => {
  const _id = req.params.id; //get the object id of the deleted stock
  const reason = req.params.reason; // get the delete reson

  try {
    
    //changing delete count to 1 and set the delete reason
    const deletedStock = await Battery.findByIdAndUpdate(_id,{'isDeleted.count' : 1,'isDeleted.description' : reason},{new : true})

    res.status(200).json({ message: "Battery deleted successfully",stock : deletedStock }); // Send a success message with deleted item
  } catch (error) {
    res.status(500).json({ message: "Failed to delete battery", error });
  }
};

//update battery
export const updateBattery = async (req, res) => {
  const stock_id = req.params.id;

  console.log(req.body);
  const updateFields = {
    quantity: req.body.quantity,
    added_date: req.body.added_date,
    warranty: req.body.warnty_priod,
    sellingPrice: req.body.sellingPrice,
    actualPrice: req.body.actualPrice,
    batteryBrand: req.body.batry_brand,
    batteryDescription: req.body.Battery_description,
  };

  try {
    const updatedBattery = await Battery.findByIdAndUpdate(
      stock_id,
      updateFields,
      { new: true }
    );

    if (!updatedBattery) {
      // If the battery is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Battery not found" });
    }

    res.status(200).json(updatedBattery); // Send the updated battery as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to update battery", error });
  }
};

// get battery details
export const getBattery = async (req, res) => {
  const stock_id = req.params.id;

  try {
    const battery = await Battery.findById(stock_id);

    if (!battery) {
      // If the battery is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Battery not found" });
    }

    res.status(200).json(battery); // Send the battery as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch battery", error });
  }
};

//delete battery from stock
export const rejectStock = async (req, res) => {
  const stock_id = req.params.id;

  try {
    const deletedBattery = await Battery.findByIdAndRemove(stock_id);

    if (!deletedBattery) {
      // If the battery is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Battery not found" });
    }

    res.status(200).json({ message: "Battery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete battery", error });
  }
};


export const getRequestedStocks = async (req,res) =>{

  try{
    const requestedStocks = await Battery.find({status : "REQUESTED"});

    // sends requested stocks to the frontend
    res.status(200).json(requestedStocks);
  }catch(error){
    res.status(500).json({error:error,message:"Error while getting requested stocks"})
  }
};

export const acceptStocks = async(req,res) =>{
  const _id = req.body.stockId;
  try{

  //updated stock status 
  const acceptedStock = await Battery.findByIdAndUpdate(_id,{status:"ACCEPTED"},{new:true});

  //send the success status
  res.status(200).json(acceptedStock);

}catch(error){
  res.status(500).json({error:error,message:"Error while updating the stock status"});
}

}

export const getDeletedBatteries = async(req,res) =>{

  // get batteries
  try{

    const deletedStocks = await Battery.find({"isDeleted.count":1});

    if(deletedStocks.length === 0){
      res.status(204).json(deletedStocks);
    }

    // sends the deleted batteries 
    res.status(200).json(deletedStocks);

  }catch(error){
    res.status(500).json({error: error,meesage:"Error while getting deleted stocks details"})
  }
};

export const updateRequestedItems = async (req, res) => {
  const stock_id = req.params.id;

  
  const updateFields = {
    quantity: req.body.quantity,
    added_date: req.body.added_date,
    warranty: req.body.warnty_priod,
    sellingPrice: req.body.sellingPrice,
    actualPrice: req.body.actualPrice,
    batteryBrand: req.body.batry_brand,
    batteryDescription: req.body.Battery_description,
  };
  console.log(updateFields);

  try {
    const updatedBattery = await Battery.findByIdAndUpdate(
      stock_id,
      updateFields,
      { new: true }
    );

    if (!updatedBattery) {
      // If the battery is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Battery not found" });
    }

    res.status(200).json(updatedBattery); // Send the updated battery as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to update battery", error });
  }
};

