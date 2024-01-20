import mongoose from "mongoose";
import "dotenv/config";

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`💻 Database is synced!`);
    })
    .catch((error) => {
      console.log(error.message);
    });
};


export default dbConnect;
