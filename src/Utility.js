"use strict";

import fs from "fs";

/* Utility functions. */
const Utility = {

  /** 
   * Wrapper for standard function. 
   */
  isDirectory: (path) => fs.lstatSync(path).isDirectory(),

  /**
   * Check if the string is empty or contains only white spaces.
   */
  isEmpty: (string) => (string.length === 0 || !string.trim()),

  /** 
   * Trim the unwanted part @param {string} noise 
   * from the word @param {string} word.
   */
  trim: (word, noise) => {
    // Form the regex for "noise". e.g., "noise" --> /[n][o][i][s][e]/g
    let regex = new RegExp(noise.split("").map((i) => `[${i}]`).join(""), "g");

    // Replace the pattern from the string.
    return word.replace(regex, "");
  },

  /** 
   * Removes the multiline comments from a string @param string. 
   */
  removeComments: (string) =>
    [Utility.getMultiLineCommentCount(string), string.replace(/\/\*.*?\*\/[\n]?/sg, '')]
  ,

  /** 
   * Checks if the line @param line has a single line comment. 
   */
  isSingleLineComment: (line) =>
    ((line.match(/^[\s]*\/\/.*$/i) != null) ? true : false)
  ,

  /** 
   * Returns the multi-line comments in a string @param string as an array. 
   */
  getMultiLineComments: (string) =>
    string.match(/\/\*.*?\*\/[\n]?/sg) || []
  ,

  /** 
   * Get the count of multi-line comments in a string @param string 
   */
  getMultiLineCommentCount: (string) => {
    let count = 0;
    Utility.getMultiLineComments(string).map((line) => {
      // Split the comments for multiple lines in a multi-line comment.
      let list = line.split("\n");
      list.map((item) => {
        // Count only those lines which have some characters in them.
        if (item.trim().length > 0) {
          count++;
        }
      });
    });

    return count;
  }
};

export default Utility;
