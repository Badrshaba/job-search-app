import mongoose from "mongoose";

const db_connection = async () => {
 await mongoose
    .connect(process.env.CONNECTION_DB)
    .then((res) => console.log("db connected successfully"))
    .catch((err) => console.log("db fail", err));
};

export default db_connection