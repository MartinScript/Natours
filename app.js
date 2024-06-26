const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//using third party middleware

const app = express();

////////////////////////////////////////////////////////////////////////////////
//implenting security http headers
app.use(helmet());

//middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

//implementing rate-limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}));

//data sanitization against NOSQL query attacks
app.use(mongoSanitize());

//data sanitization against XSS(cross-side scripting) attacks
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'difficulty',
        'price']
}));

//serving static files
app.use(express.static(`${__dirname}/public`));

//creating your own middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

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
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;