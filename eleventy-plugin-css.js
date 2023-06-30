const postcss = require('postcss')

/**
 * @callback PluginFilter
 * @param {string} inputContent
 * @param {string} inputPath
 */

/**
 * @typedef {Object} PluginOptions
 * @property {Array<import('postcss').AcceptedPlugin>} [postcssPlugins]
 * @property {PluginFilter} filter
 */

module.exports = function(eleventyConfig, /**@type {PluginOptions}*/ pluginOptions = {}) {
  const postcssPlugins = pluginOptions.postcssPlugins
    ?? [
      require('postcss-import'),
      require('autoprefixer'),
      process.env.NODE_ENV === 'production' && require('postcss-csso'),
    ].filter(Boolean)

  async function processStyles({ source, options, plugins = postcssPlugins }) {
    const opts = {
      from: undefined,
      ...options
    }

    const result = await postcss(plugins).process(source, opts)
    return result
  }

  eleventyConfig.addFilter('processStyles', async function(source, options) {
    const cssOutput = await processStyles({ source, options })
    return cssOutput.css
  })

  eleventyConfig.addTemplateFormats('css')

  eleventyConfig.addExtension('css', {
    read: true,

    encoding: 'utf-8',

    outputFileExtension: 'css',

    compileOptions: {
      permalink(inputContent, inputPath) {
        return function(data) {
          return data.permalink
        }
      }
    },

    async compile(inputContent, inputPath) {
      if (typeof pluginOptions.filter === 'function' && !pluginOptions.filter(inputContent, inputPath)) {
        return
      }

      const result = await processStyles({
        source: inputContent,
        options: {
          from: inputPath
        }
      })

      const dependencies = (result.messages ?? [])
        .filter((message) => message.type === 'dependency' && message.plugin === 'postcss-import')
        .map((message) => message.file)

      this.addDependencies(inputPath, dependencies)

      return async function(data) {
        return result.css
      }
    }
  })
}