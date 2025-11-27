import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { AuthRouter } from './routers/auth.router';
import { locationRouter } from './routers/location.router';
import { CategoryRouter } from './routers/category.router';
import { EventRouter } from './routers/event.route';
import { userRouter } from './routers/user.router';
import { join } from 'path';
import { voucherRouter } from './routers/voucher.router';
import { reviewRouter } from './routers/review.router';
import { transactionRouter } from './routers/transaction.router';
import { AdminRouter } from './routers/admin.router';
export default class App {
    app;
    constructor() {
        this.app = express();
        this.configure();
        this.routes();
        this.handleError();
    }
    configure() {
        this.app.use(cors());
        this.app.use(json());
        this.app.use(urlencoded({ extended: true }));
    }
    handleError() {
        this.app.use(ErrorMiddleware);
    }
    routes() {
        const authRouter = new AuthRouter();
        const LocationRouter = new locationRouter();
        const categoryRouter = new CategoryRouter();
        const eventRouter = new EventRouter();
        const UserRouter = new userRouter();
        const VoucherRouter = new voucherRouter();
        const ReviewRouter = new reviewRouter();
        const TransactionRouter = new transactionRouter();
        const adminRouter = new AdminRouter();
        this.app.get('/', (req, res) => {
            res.send(`Hello !!`);
        });
        this.app.use('/', express.static(join(__dirname, '../public')));
        this.app.use('/auth', authRouter.getRoutes());
        this.app.use('/locations', LocationRouter.getRouter());
        this.app.use('/categories', categoryRouter.getRoutes());
        this.app.use('/events', eventRouter.getRoutes());
        this.app.use('/user', UserRouter.getRouter());
        this.app.use('/vouchers', VoucherRouter.getRouter());
        this.app.use('/reviews', ReviewRouter.getRouter());
        this.app.use('/transactions', TransactionRouter.getRouter());
        this.app.use('/admin', adminRouter.getRoutes());
    }
}
