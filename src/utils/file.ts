import fs from 'fs';
import { join } from "path";

export const deletfile = (path: string, fileName: string) => {
    fs.unlinkSync(join(__dirname,`${path}/${fileName}`));
};

