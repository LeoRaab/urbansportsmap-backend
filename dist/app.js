"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const venues_routes_1 = require("./routes/venues-routes");
const users_routes_1 = require("./routes/users-routes");
const favorites_routes_1 = require("./routes/favorites-routes");
const comments_routes_1 = require("./routes/comments-routes");
const http_error_1 = require("./models/http-error");
const messages_1 = require("./constants/messages");
const images_routes_1 = require("./routes/images-routes");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/api/venues', venues_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/favorites', favorites_routes_1.default);
app.use('/api/comments', comments_routes_1.default);
app.use('/api/images', images_routes_1.default);
app.use((req, res, next) => {
    next(new http_error_1.default(messages_1.default.NO_ROUTE_FOUND, 404));
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || messages_1.default.UNKNOWN_ERROR });
});
mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o2nyk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(5000);
})
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=app.js.map