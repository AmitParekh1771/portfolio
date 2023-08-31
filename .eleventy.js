const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/");

    eleventyConfig.addTransform("htmlmin", function(content) {
        // Prior to Eleventy 2.0: use this.outputPath instead
        if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
            return htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
          });
        }
        return content;
    });

    return {
        dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
            layouts: "_layouts"
        }
    };
}