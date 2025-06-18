import AdminJS from 'adminjs';
import AdminJsExpress from '@adminjs/express';
import * as AdminMongoose from  '@adminjs/mongoose';
import {dark ,light, noSidebar} from '@adminjs/themes';
import dotenv from 'dotenv';
import session from 'express-session'
import ConnectMongoDBSession from 'connect-mongodb-session';
import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Ticket from '../models/Ticket.js';

dotenv.config();
AdminJS.registerAdapter(AdminMongoose);
const Default_Admin = {
    email :process.env.Admin_email,
    password:process.env.Admin_password
}
const authenticate = async(email,password)=>{
    if(email === Default_Admin.email && password === Default_Admin.password)
        return Promise.resolve(Default_Admin);
    return null

}
export const buildAdminJS =async(app)=>{
    const admin  = new AdminJS({
        resources:[{resource:User},{resource:Bus},{resource:Ticket}],
        branding:{
            companyName:'BusBooking',
            withMadeWithLove:false

        },
        defaultTheme:dark.id,
        availableThemes:[dark,light,noSidebar],
        rootPath:'/admin'
    })
    const MongoDBStore = ConnectMongoDBSession(session);
    const sessionStore = new MongoDBStore({
        uri :process.env.MONGO_URI,
        collection:"session"
    })
    const adminRouter = AdminJsExpress.buildAuthenticatedRouter(admin,{
        authenticate,cookieName:"adminjs",cookiePassword:"ydgfjhsvjhsv645541jhdfvey"
    },
    null,
    {
        store:sessionStore,
        resave:true,
        saveUninitialized:true,
        secret:'ydgfjhsvjhsv645541jhdfvey',
        

        name:"adminjs",
    },



)
app.use(admin.options.rootPath,adminRouter)
}

