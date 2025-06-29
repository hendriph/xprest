require('dotenv').config();
const compression = require('compression')
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(compression())
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(morgan('dev'));

// Success Response
const responseWrapper = require('./middlewares/responseWrapper');
app.use(responseWrapper);

const baseRoute = require('./routes');
app.use('/', baseRoute);
app.get('/health', (req, res) => res.send('xprest is running!'));

// Swagger Docs
const swagger = require('./middlewares/swagger');
app.use('/docs', swagger.serve, swagger.setup);

// Error handler
const errorHandler = require('./middlewares/error');
app.use(errorHandler);

module.exports = app;
