const express = require('express');
const path = require('path')
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.sendFile('./src/index.html', { root: __dirname });
});

app.use('/static', express.static(path.join(__dirname, 'static')))

// app.get('/about', (req, res) => {
//     res.sendFile('./landing-page/about.html', { root: __dirname });
// });

// app.get('/contact', (req, res) => {
//     res.sendFile('./landing-page/contact.html', { root: __dirname });
// });

app.listen(port, () => console.log(`listening on port ${port}!`))