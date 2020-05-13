const APIBuilder = require("./apiBuilder");
var pm = null;
/* istanbul ignore next */
if (require.resolve("picomatch")) pm = require("picomatch");

function Builder() {
  this.maxDepth = Infinity;
  this.suppressErrors = true;
}

Builder.prototype.crawl = function(path) {
  return new APIBuilder(path, this);
};

Builder.prototype.crawlWithOptions = function(path, options) {
  if (!options.maxDepth) options.maxDepth = Infinity;
  options.groupVar = options.group;
  options.onlyCountsVar = options.onlyCounts;
  options.excludeFn = options.exclude;
  options.filterFn = options.filter;
  return new APIBuilder(path, options);
};

Builder.prototype.withBasePath = function() {
  this.includeBasePath = true;
  return this;
};

Builder.prototype.withDirs = function() {
  this.includeDirs = true;
  return this;
};

Builder.prototype.withMaxDepth = function(depth) {
  this.maxDepth = depth;
  return this;
};

Builder.prototype.withFullPaths = function() {
  this.resolvePaths = true;
  this.includeBasePath = true;
  return this;
};

Builder.prototype.withErrors = function() {
  this.suppressErrors = false;
  return this;
};

Builder.prototype.group = function() {
  this.groupVar = true;
  return this;
};

Builder.prototype.normalize = function() {
  this.normalizePath = true;
  return this;
};

Builder.prototype.filter = function(filterFn) {
  this.filterFn = filterFn;
  return this;
};

Builder.prototype.glob = function(...patterns) {
  /* istanbul ignore next */
  if (!pm) {
    throw new Error(
      `Please install picomatch: "npm i picomatch" to use glob matching.`
    );
  }
  const isMatch = pm(patterns);
  this.filterFn = (path) => {
    return isMatch(path, patterns);
  };
  return this;
};

Builder.prototype.exclude = function(excludeFn) {
  this.excludeFn = excludeFn;
  return this;
};

Builder.prototype.onlyCounts = function() {
  this.onlyCountsVar = true;
  return this;
};

module.exports = Builder;
