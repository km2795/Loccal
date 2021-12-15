"use strict";

import async from 'async';
import fs from 'fs';
import logUpdate from 'log-update';
import Path from "path";
import Config from "./Config";
import FileStats from "./FileStats";
import Utility from "./Utility";

const LocCalculator = {

  /**
   * Get the number of lines in the file @param filePath. 
   * Without any modifications (neglect any comments, etc.) 
   */
  getFileStats: (filePath) =>
    LocCalculator.analyzeFile(filePath, fs.readFileSync(filePath).toString()),

  /**
   * Processes the file content according to the options provided.
   */
  analyzeFile: (filePath, fileContent) => {
    let content = fileContent.toString();
    let fileStats = new FileStats(filePath);

    // If multi-line comments are to be excluded or not.
    if (Config.CleanLines || Config.NoComments) {
      [fileStats.comments.multi, content] = Utility.removeComments(content);
    }

    let lines = content.split('\n');
    fileStats.lines = lines.length;

    // Start removing the empty lines or comments, if asked.
    if (Config.CleanLines || Config.NoComments) {
      lines.map((line) => {
        // Don't include any empty lines.
        if (Config.CleanLines && Utility.isEmpty(line)) {
          fileStats.empty++;
        }
  
        // Don't include any comments.
        if (Config.NoComments && Utility.isSingleLineComment(line)) {
          fileStats.comments.single++;
        }
      });
    }

    // Remove the empty and single comments from actual lines.
    fileStats.lines -= (fileStats.empty + fileStats.comments.single);

    // Fill the remaining statistics of the file.
    fileStats.total = fileStats.lines + fileStats.comments.single 
      + fileStats.comments.multi + fileStats.empty;

    return fileStats;
  },

  /** 
   * Get the content of the main path @param path 
   */
  getPathContent: (path) => {
    if (Utility.isDirectory(path)) {
      // Prepend the directory path to the file's/dir's name.
      return fs.readdirSync(path).map((item) => Path.join(path, item));
    } else {
      // In case path provided is a file. Return the path back.
      return [path];
    }
  },

  /**
   * Get the content of all sub-directories too.
   * Main method that consolidates all the files in 
   * the main directory and the sub-directories.
   * @param nonRecursive is for cases where sub-directories are 
   * not to be traversed.
   */
  getWholePathContent: (path, finalList, nonRecursive) => {
    // Get the content of the parent directory and traverse through it.
    LocCalculator.getPathContent(path).map((item) => {
      if (Utility.isDirectory(item)) {
        // If the directory is excluded, don't go further into it.
        if (!LocCalculator.isDirectoryExcluded(Path.basename(item))) {
          // Recurse further down a sub-directory.
          if (!nonRecursive) {
            LocCalculator.getWholePathContent(item, finalList);
          }
        }
      } else {
        // Check if the file extension or the file itself is denied or not.
        if (LocCalculator.checkFile(item)) {
          // Otherwise push the file in the main container.
          finalList.push(item);
        }
      }
    });
  },

  /** 
   * Gather files and then send them for calculation. 
   */
  consolidateFilesForCalculation: (filePath, recursive, callback) => {
    let fileList = [];
    LocCalculator.getWholePathContent(filePath, fileList, !recursive);
    if (fileList !== null) {
      LocCalculator.calculateLoc(fileList, (result) => callback(result));
    }
  },

  /**
   * Calculate the LOC for the files provided through 
   * argument @param files, return the stats.
   */
  calculateLoc: (files, callback) => {
    let info = {};
    let countProgress = 0;
    let totalFileCount = files.length;

    console.log('Total Files: ' + totalFileCount);
    async.each(files, (file, callback) => {

      // Update the progress.
      logUpdate(
        `Progress: ${Math.trunc((++countProgress / totalFileCount) * 100)}%`
      );

      let stats = LocCalculator.getFileStats(file);
      info[file] = stats;

      // Update the total stats.
      Config.TotalEmptyLines += stats.empty;
      Config.TotalComments.Single += stats.comments.single;
      Config.TotalComments.Multi += stats.comments.multi;
      Config.TotalLoc += stats.lines;

      callback(null);
    }, (err) => {
      callback(info);
    });
  },

  /**
   * If the file is allowed or not.
   */
  checkFile: (file) => 
    (!LocCalculator.isFileExcluded(file) && LocCalculator.checkExtension(file))
  ,

  /**
   * If the file is allowed or not.
   */
  checkExtension: (file) => {
    let base = Path.basename(file);

    // Check in the allowed extensions first.
    if (LocCalculator.checkAllowedExtensions(base)) { return true; }

    // Then, in the excluded extensions.
    if (LocCalculator.checkExcludedExtensions(base)) { return false; }

    /*
     * Since the above two conditions didn't pass, this extension 
     * is neither mentioned in allowed nor in excluded array. If 
     * the AllowedExtensions array has some extensions, then we can 
     * discard this extension, otherwise allow it.
     */
    return (Config.AllowedExtensions.length > 0 ? false : true);
  },

  checkAllowedExtensions: (base) => 
    Config.AllowedExtensions.find((ext) => 
		  base.match(new RegExp(`.*${ext}$`, "i"))) ? true : false
  ,

  checkExcludedExtensions: (base) => 
    Config.ExcludedExtensions.find((ext) => 
      base.match(new RegExp(`.*${ext}$`, "i"))) ? true : false
  ,

  /** 
   * If the file @param file is to be excluded from calculation.
   */
  isFileExcluded: (file) => {
    let base = Path.basename(file);
    return Config.ExcludedFiles.find(
      (file) => base === Path.basename(file)) ? true : false;
  },

  /** 
   * If the directory @param dir is to be excluded from traversal.
   */
  isDirectoryExcluded: (dir) => {
    let base = Path.basename(dir);
    return Config.ExcludedDirectories.find(
      (file) => base === Path.basename(file)) ? true : false;
  }

};

export default LocCalculator;
