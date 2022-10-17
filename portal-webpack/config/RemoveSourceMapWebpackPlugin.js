// Ref: https://www.npmjs.com/package/@rbarilani/remove-source-map-url-webpack-plugin
const { sources, Compilation } = require('webpack');
const fs = require('fs');
const path = require('path');

class RemoveSourceMapWebpackPlugin {
  constructor(opts) {
    this.options = opts || {};
    this.options.sourceFileTest = this.options.sourceFileTest || /\.(js|css)$/i;
    this.removedFiles = [];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('RemoveSourceMapWebpackPlugin', (compilation) => {
      // Remove soucemap URLs only, so Sentry can still use sourcemaps
      compilation.hooks.processAssets.tap({
        name: 'RemoveSourceMapWebpackPlugin',
        // HACK: should be the last stage, so all assets and sourcemaps are ready :(
        stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
      }, (assets) => {
        // process assets
        this.removedFiles = [];
        const count = this.processAssets(assets).reduce((acc, { filename, source }) => {
          // update asset for the current compilation
          compilation.updateAsset(filename, source);
          this.removedFiles.push(filename);
          return acc + 1;
        }, 0);

        console.log(`RemoveSourceMapWebpackPlugin: Removed sourcemap URLs from ${count}/${Object.keys(assets).length} asset(s).`);
      });
    });

    // Remove soucemaps itself after being uploaded to Sentry successfully
    compiler.hooks.done.tap('RemoveSourceMapWebpackPlugin', (stats) => {
      let countMatchMapAssets = 0;
      this.removedFiles.forEach((filename) => {
        const filePath = path.join(stats.toJson().outputPath, `${filename}.map`);
        try {
          if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            countMatchMapAssets += 1;
          } else {
            throw Error();
          }
        } catch (err) {
          console.error(`RemoveSourceMapWebpackPlugin: Cannot find sourcemap file to remove at: ${filePath}`);
        }
      });

      console.log(`RemoveSourceMapWebpackPlugin: Removed ${countMatchMapAssets}/${this.removedFiles.length} sourcemap(s).`);
    });
  }

  processAssets(assets) {
    return Object.keys(assets)
      .filter((filename) => this.testFileName(filename, this.options.sourceFileTest))
      .map((filename) => {
        const asset = assets[filename];
        const source = asset
          .source()
          .replace(/# sourceMappingURL=(.+?\.map)/g, '# $1');
        return {
          filename,
          source: new sources.RawSource(source),
        };
      });
  }

  testFileName(filename, test) {
    if (test instanceof RegExp) {
      return test.test(filename);
    }

    if (typeof test === 'string') {
      return test === filename;
    }

    if (typeof test === 'function') {
      return test(filename);
    }

    throw new Error(
      'RemoveSourceMapWebpackPlugin: Invalid test option. May be a RegExp (tested against asset key), a string containing the key, a function(key): bool',
    );
  }
}

module.exports = RemoveSourceMapWebpackPlugin;
