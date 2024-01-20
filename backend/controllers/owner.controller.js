import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";


export const adminLogin = async (req, res) => {
  // get details from the request body
  const NIC = req.body.emailOrNic;
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
          data.role === "ADMIN"
        ) {
          // create access Token
          const accessToken = jwt.sign(
            { _id: data._id, role: data.role },
            process.env.SECRET_KEY,
            { expiresIn: 24 * 60 * 60 }
          ); //access Token will expires in 1 day

          //   set access Token as a http only cookie
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
          }); //this cookie expires in 1 day

          //   create user details
          const userDetails = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone,
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
      res.status(404).json({ error: error.message });
    });
};

export const logout = (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.status(200).json({});
};



