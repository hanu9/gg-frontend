const minify = require('html-minifier').minify;

exports.homePage = function(req, res) {
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
