"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const configs_1 = require("./configs");
const error_middleware_1 = require("./middlewares/error.middleware");
const admin_router_1 = __importDefault(require("./routers/admin.router"));
const location_router_1 = __importDefault(require("./routers/location.router"));
const category_router_1 = __importDefault(require("./routers/category.router"));
const event_route_1 = __importDefault(require("./routers/event.route"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const voucher_router_1 = __importDefault(require("./routers/voucher.router"));
const review_router_1 = __importDefault(require("./routers/review.router"));
const transaction_router_1 = __importDefault(require("./routers/transaction.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const path_1 = require("path");
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", express_1.default.static((0, path_1.join)(__dirname, "../public")));
// ROUTERS
app.get("/", (req, res) => {
    res.send("This is mini project");
});
app.use("/auth", auth_router_1.default);
app.use("/locations", location_router_1.default); // DITAMBAH "/"
app.use("/categories", category_router_1.default);
app.use("/events", event_route_1.default);
app.use("/user", user_router_1.default);
app.use("/vouchers", voucher_router_1.default);
app.use("/reviews", review_router_1.default);
app.use("/transactions", transaction_router_1.default);
app.use("/admin", admin_router_1.default);
// error middleware
app.use(error_middleware_1.ErrorMiddleware);
app.listen(configs_1.PORT, () => {
    console.log(`server started on port ${configs_1.PORT}`);
});
