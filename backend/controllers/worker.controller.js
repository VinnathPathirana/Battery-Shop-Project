import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

//generate Worker Id
const generateWorkerId = async () => {
  //get last Worker object, if there is a worker, then return that worker object, otherwise return empty array
  const lastWorkerDetails = await User.find({role:"WORKER"}).sort({ _id: -1 }).limit(1);

  //check if the result array is empty or not, if its empty then return first stock ID
  if (lastWorkerDetails.length == 0) {
    return "WRK-1";
  }

  //if array is not null, last get last Worker Id
  const workerId = lastWorkerDetails.map((data) => {
    return data.id;
  });


  //then we get the Integer value from the last part of the ID
  const oldWorkerId = parseInt(workerId[0].split("-")[1]);

  const newWorkerId = oldWorkerId + 1; //then we add 1 to the past value

  return  `WRK-${newWorkerId}`;//return new Worker Id
};


export const workerLogin = async (req, res) => {
  // get details from the request body
  const NIC = req.body.nic;
  const password = req.body.password;

  console.log(NIC, password);
  User.find({ nic: NIC })
    .then((data) => {
      if (data.length > 0) {
        // extract user details from user array
        data = data[0];

        //   compare database password and user entered password and role
        if (
          bcrypt.compareSync(password, data.password) &&
          (data.role === "ADMIN" || data.role === "WORKER")
        ) {

            // create access Token
          const accessToken = jwt.sign(
            { _id: data._id, role: data.role },
            process.env.SECRET_KEY,
            { expiresIn: 24 * 60 * 60 }
          ); //access Token will expires in 1 day



        //   set access Token as a http only cookie
          res.cookie("accessToken",accessToken,{httpOnly:true,maxAge:24*60*60*1000,secure : false});//this cookie expires in 1 day
        
        //   create user details
          const userDetails = {
            _id : data._id,
            name : data.name,
            email : data.email,
            role : data.role,
            phone : data.phone
          };

        //   sends the user details
        res.status(200).json(userDetails);

        } else {
          throw new Error("Password is wrong");
        }
      } else {
        throw new Error("Does not exist this user");
      }
    })
    .catch((error) => {
      res.status(404).json({error: error.message});
    });
};

export const logout = (req,res) =>{
  res.cookie('accessToken','',{maxAge : 1});
  res.status(200).json({});
}

export const getAllWorkers = async (req, res) => {

  try {
    const workers = await User.find({ role: "WORKER" });
    
    if (workers.length === 0) {

      // If no workers found, send a 404 status code with a message
      return res.status(204).json({message:"workers not found"});
    }

    // Extract only the necessary details from the workers
    const workerDetails = workers.map((worker) => ({
      _id: worker._id,
      worker_id : worker.id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      address: worker.address,
      nic : worker.nic,
      gender : worker.gender,

    }));

    res.status(200).json(workerDetails); // Send the worker details as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workers", error });
  }
};

export const deleteWorker = async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedWorker = await User.findByIdAndDelete(_id);

    if (!deletedWorker) {
      // If the worker is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete worker", error });
  }
};

export const updateWorker = async (req, res) => {
  
  const _id = req.params.id;

  const updateFields = {
   name : req.body.name,
   email :req.body.email,
   phone :  req.body.phone,
   address : req.body.address,
   nic : req.body.nic,
   gender : req.body.gender,
  }
  
  try {
    const updatedWorker = await User.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });

    if (!updatedWorker) {
      // If the worker is not found, send a 404 status code with a message
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(updatedWorker); // Send the updated worker as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to update worker", error });
  }
};


export const registerWorker = async (req, res) => {

  try {
    const existingWorker = await User.findOne({nic:req.body.nic });
  if (existingWorker) {
    console.log("user exist");
    return res.status(409).json({ message: "Worker already exists" });
  }

  // generating the custom ID
  const customId = await generateWorkerId();

  console.log(customId);

  // hashing the password
  const salt =  await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  console.log(hashedPassword);

  const newWorker = new User({  
    id : customId,
    name: req.body.name,
    email: req.body.email,
    nic:req.body.nic,
    password: hashedPassword,
    phone: req.body.phone,
    role:"WORKER",
    address: req.body.address,
    gender: req.body.gender,
  });

  console.log(newWorker);

  const savedWorker = await newWorker.save();
  res.status(201).json(savedWorker);
  } catch (error) {
    console.log(error)
    // res.status(500).json({ message: "Failed to register worker", error });
  }
};
