import App from "./main";

const expressApp = new App().app;

// Express membutuhkan handler function
export default (req: any, res: any) => {
  expressApp(req, res);
};
