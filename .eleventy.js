const htmlmin = require("html-minifier");
const tailwind = require('tailwindcss');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

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
    
    eleventyConfig.addWatchTarget('./src/_includes/styles/');
	eleventyConfig.addNunjucksAsyncFilter('postcss', async (code, callback) => {
        try {
            const minified = await postCss([
                tailwind(require('./tailwind.config')), 
                autoprefixer(), 
                cssnano({ preset: 'default' })
            ]).process(code, { from: './src/_includes/styles.css' });
            callback(null, minified.css);
        } catch (err) {
            callback(null, code);
            console.error("PostCss error: ", err);
        }
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