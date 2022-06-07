/**
 * TODO: Logging system
 */

import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

import venuesRoutes from './routes/venues-routes';
import usersRoutes from './routes/users-routes';
import favoritesRoutes from './routes/favorites-routes';
import commentsRoutes from './routes/comments-routes';

import HttpError from './models/http-error';
import MESSAGES from './constants/messages';
import imagesRoutes from './routes/images-routes';

const app = express();

app.use(bodyParser.json());

/*
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});
 */

app.use(cors());

app.use('/api/venues', venuesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/images', imagesRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(MESSAGES.NO_ROUTE_FOUND, 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || MESSAGES.UNKNOWN_ERROR});
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o2nyk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000);
    })
    .catch((error) => {
        console.log(error);
    });