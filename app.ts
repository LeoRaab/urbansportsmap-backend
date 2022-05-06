import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import venuesRoutes from './routes/venues-routes';
import usersRoutes from './routes/users-routes';
import favoritesRoutes from './routes/favorites-routes';
import commentsRoutes from './routes/comments-routes';

import HttpError from './models/http-error';

const app = express();

app.use(bodyParser.json());

app.use('/api/venues', venuesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comments', commentsRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new HttpError('Could not find this route.', 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect('mongodb+srv://leo:vniepRsw2myMBDqI@cluster0.o2nyk.mongodb.net/urbansportsmap?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch((error) => {
        console.log(error);
    });