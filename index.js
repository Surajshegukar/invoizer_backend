const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const itemRoute = require('./routes/item/router');
const invoiceRoute = require('./routes/invoice/router');
const authRoute = require('./routes/auth/router');
const studentRoute = require('./routes/student/router');
const connectDB = require('./dbConnect');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();



app.use('/api/item',itemRoute );
app.use('/api/invoice',invoiceRoute );
app.use('/api/auth',authRoute );
app.use('/api/student',studentRoute );

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(5000, () => {
    console.log('Server is running on : http://localhost:5000');
    }
);