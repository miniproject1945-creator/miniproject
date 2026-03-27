import fs from 'fs';
import { join } from "path";
export const deletfile = (path, fileName) => {
    fs.unlinkSync(join(__dirname, `${path}/${fileName}`));
};
