const EleventyPluginCSS = require('../eleventy-plugin-css.js')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginCSS, {
    filter(inputContent, inputPath) {
      return !inputPath.includes('components')
        && !inputPath.includes('blocks')
    }
  })

  return {
    dir: {
      input: 'src'
    }
  }
}