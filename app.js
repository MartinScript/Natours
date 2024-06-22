const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//using third party middleware

const app = express();

////////////////////////////////////////////////////////////////////////////////
//middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//creating your own middleware

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//implementing rate-limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);
//get methods
// app.get('/', (req, res) => {
//     res.status(200).send('Hello, world!');
// });
////////////////////////////////////////////////////////////////////////////////////

//TOURS HANDLERS

//USERS HANDLER



//Tour's routes
// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour);

//api post routes
// app.post('/api/v1/tours', createTour);

// //api delete routes
// app.delete('/api/v1/tours/:id', deleteTour);

////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;