import  express from "express";
import cors from "cors";
import helmet from "helmet";

import { PORT } from "./configs/env.configs";
import router from "./routers";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// roters
app.use("/api", router);


// error middleware
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
})


