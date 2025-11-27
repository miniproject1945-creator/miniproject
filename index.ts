
import {VercelRequest, VercelResponse} from "@vercel/node"
import app from "./dist/src";

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res); 
}
