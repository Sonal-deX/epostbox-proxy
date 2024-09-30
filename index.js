const express = require('express');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// accept requests from defined origin
app.use(cors());

app.post('/api/customers/register', (req, res) => {
    const body = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        country: req.body.country,
        address_line_1: req.body.address_line_1,
        city: req.body.city,
        postalCode: req.body.postalCode
    };

    const apiUrl = 'https://auth.dev.keyflowz.com/api/customers/register';

    axios.post(apiUrl, body)
        .then(response => {
            if (res.status == 201) {
                res.status(response.status).json(response.data);
            } else if (res.status == 400) {
                res.json({ message: "Email Already registered" });
            }

        })
        .catch(error => {
            console.error('Error:', error || error);

            if (error.response) {
                res.status(error.response.status).json({
                    message: error.response.data.message || 'Request failed',
                });
            } else if (error.request) {
                res.status(500).json({ message: 'No response received from the server' });
            } else {
                res.status(500).json({ message: 'Error in making the request' });
            }
        });
});

app.post('/api/customers/getCustomerDetails', (req, res) => {

    const token = req.body.token
    const apiUrl = `https://auth.dev.keyflowz.com/api/customers/data/${token}`;

    axios.get(apiUrl)
        .then(response => {
            res.status(response.status).json(response.data.data);

        })
        .catch(err => {
            console.log(err);
        })

})

// // Existing proxy middleware (for other API routes)
// app.use('/api', createProxyMiddleware({
//     target: 'https://auth.dev.keyflowz.com',
//     changeOrigin: true,
//     secure: false,
// }));

// Start the proxy server on port 3000
app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
