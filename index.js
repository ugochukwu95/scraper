const axios = require("axios") // used to make requests
const cheerio = require("cheerio") // used to load the html dom
const express = require('express'); // This package will be used to host the back-end servers.
const bodyParser = require('body-parser'); // This package helps configure json request parameters
const cors = require("cors"); // This package is used to enable cross-origin request sharing (CORS) requests.
const port = process.env.PORT || 3500;

// activate express
const app = express();

// configure express with cors and body-parser
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// function that loads and makes ready the DOM for parsing
async function fetchHTML(url) {
	const { data } = await axios.get(url) // get page using axios
	return cheerio.load(data); // loads the DOM for parsing
}

// Listen to requests
app.get('/', (req, res) => {
	
	// If there is a bad request return an error
	if (!req.body.url) {
		return res.status(400).send({ 
            error: "url cannot be empty"
        });
	}
	
	// return an array of images
	fetchHTML(req.body.url).then(($) => {
		let data = $('img').toArray().map((i) => $(i)[0].attribs.src).filter((item) => item !== undefined)
		res.send(JSON.stringify(data));
	}).catch(err => {
        res.status(500).send({
            error: "Some error occurred while scrapping."
        });
    });

});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
