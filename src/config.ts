const dotenv = require('dotenv');
dotenv.config();

export const APP_CONFIG: { apikey: string, workspace: string } = {
    apikey: process.env.APIKEY as string,
    workspace: process.env.WORKSPACE as string,
}
