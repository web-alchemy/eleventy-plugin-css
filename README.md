# Eleventy plugin for CSS

## Installation

```sh
npm install @web-alchemy/eleventy-plugin-css
```

## Configuration

```javascript
const EleventyPluginCSS = require('@web-alchemy/eleventy-plugin-css')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginCSS, {
    // function for filtering files to be processed
    // by default, all CSS files are processed in input directory
    filter(inputContent, inputPath) {
      return !inputPath.includes('components')
        && !inputPath.includes('blocks')
    },
    
    // plugins for `postcss` (https://github.com/postcss/postcss)
    // default:
    postcssPlugins: [
      require('postcss-import'),
      require('autoprefixer'),
      process.env.NODE_ENV === 'production' && require('postcss-csso'),
    ]
  })

  return {
    dir: {
      input: 'src'
    }
  }
}
```

## Usage

```css
---
permalink: '/assets/main.css'
---
@charset 'utf-8';

@import 'components/header.css';
@import 'components/footer.css';
@import 'components/button.css';
```
Plugin provides Eleventy async filter for processing styles. Example for nunjucks:

```nunjucks
{% set styles %}
.header {
  display: flex;
}
{% endset %}

<style>{{ styles | processStyles }}</style>
```