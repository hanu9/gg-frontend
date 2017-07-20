const minify = require('html-minifier').minify;
const logger = require("../loggers");

exports.homePage = function(req, res) {
	// logger.trace.info(req,JSON.stringify(req.general));
	// logger.api.info(req,"home page api");
	// logger.rr.info(req,"home page rr");

	res.render("index.html",{},function(err, html){
        html = minify(html, {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true
        });
        res.status(200).send(html);
    });
};
