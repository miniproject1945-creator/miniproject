import express, { json, urlencoded, Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './configs';
import { ErrorMiddleware } from './middlewares/error.middleware';

import AdminRouter from './routers/admin.router';
import locationRouter from './routers/location.router';
import CategoryRouter from './routers/category.router';
import EventRouter from './routers/event.route';
import userRouter from './routers/user.router';
import voucherRouter from './routers/voucher.router';
import reviewRouter from './routers/review.router';
import transactionRouter from './routers/transaction.router';
import authRouter from './routers/auth.router';

import { join } from 'path';

const app = express();

// middleware
app.use(cors());
app.use(express.json());


app.use("/", express.static(join(__dirname, "../public")));

// ROUTERS
app.get("/", (req: Request, res: Response) => {
  res.send("This is mini project");
});

app.use("/auth", authRouter);
app.use("/locations", locationRouter);  // DITAMBAH "/"
app.use("/categories", CategoryRouter);
app.use("/events", EventRouter);
app.use("/user", userRouter);
app.use("/vouchers", voucherRouter);
app.use("/reviews", reviewRouter);
app.use("/transactions", transactionRouter);
app.use("/admin", AdminRouter);

// error middleware
app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
