"use strict";

function FileStats(filePath) {
  let self = this;

  // File path.
  self.filePath = filePath || "",

  // Net lines of code.
  self.lines = 0;
  self.comments = {
    multi: 0,
    single: 0
  };

  // Empty lines.
  self.empty = 0;

  // Gross lines of code.
  self.total = 0;
};

export default FileStats;
