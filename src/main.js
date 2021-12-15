"use strict";

// Load environment variables.
require("dotenv").config();

import Config from "./dist/Config";
import LocCalculator from "./dist/loccal";
import Utility from "./dist/Utility";


/* Version number of the APPLICATION. */
const VERSION_NUMBER = process.env.VERSION;

/** 
 * Parses the arguments @param args passed 
 * through the command line. 
 */
const parseInput = (args) => {
  /* Codes as per the init() function's switch's cases. */
  let code = 2;

  // If no options is passed, just return.
  if (args.length < 3) { 
    return;
  }

  // Remove the first two arguments as they are not needed.
  args.splice(0, 2);

  // Temporary variable for different cases.
  let list = [];

  while (args.length > 0) {
    let arg = args.shift();
    // For the those options that do not require any arguments. Like flags.
    switch (arg) {

      /*
       * Will override all other options and show only the 
       * help manual instead of running the program with 
       * the specified options. That is why return is used.
       */
      case "-h":
        return 10;

      case "-r":
        code = 1;
        break;

      case "-v":
        Config.DisplayLevel = 1;
        break;

      case "-c":
        Config.NoComments = 1;
        break;

      case "-oc":
        Config.CleanLines = 1;
        Config.NoComments = 1;   // Remove single line comments too.
        break;

      case "-ae":
        list = args.shift().split(",");
        for (let i = 0; i < list.length; i++) {
          Config.AllowedExtensions.push((list[i][0] === ".") ? list[i] : ("." + list[i]));
        }
        break;

      case "-ex":
        list = args.shift().split(",");
        for (let i = 0; i < list.length; i++) {
          Config.ExcludedExtensions.push((list[i][0] === ".") ? list[i] : ("." + list[i]));
        }
        break;

      case "-exf":
        list = args.shift().split(",");
        Config.ExcludedFiles = list;
        break;

      case "-exd":
        list = args.shift().split(",");
        for (let i = 0; i < list.length; i++) {
          Config.ExcludedDirectories.push(Utility.trim(list[i], "/"));
        }
        break;

      default:
        // If the argument is directory, then the directory operation.
        if (Utility.isDirectory(arg)) {
          Config.SelectedDirectory = arg;
        } else {
          Config.SingleSelectedFiles.push(arg);
          code = 3;
        }
        break;
    }
  }

  return code;
};

/** 
 * Parse the command line input and perform actions accordingly.
 */
const init = () => {
  // Parse the command line input.
  switch (parseInput(process.argv)) {
    // Nothing to do, show help manual.
    case 10:
      showHelp();
      return;

    // Do files' LOC counting recursively.
    case 1:
      LocCalculator.consolidateFilesForCalculation(Config.SelectedDirectory, true, (result) => {
        if (Config.DisplayLevel > 0) {
          console.log("\n");
          for (let item in result) {
            console.log(`${result[item].filePath}: ${result[item].lines}`);
          }
        }
        console.log(`\nTotal LOC: ${Config.TotalLoc}`);
      });
      break;

    // Do files' LOC counting in the main directory.
    case 2:
      LocCalculator.consolidateFilesForCalculation(Config.SelectedDirectory, false, (result) => {
        if (Config.DisplayLevel > 0) {
          console.log("\n");
          for (let item in result) {
            console.log(`${result[item].filePath}: ${result[item].lines}`);            
          }
        }
        console.log(`\nTotal LOC: ${Config.TotalLoc}`);
      });
      break;

    // Do LOC counting for single files.
    case 3:
      // For showing total LOC.
      let total = 0;
      for (let i = 0; i < Config.SingleSelectedFiles.length; i++) {
        let stats = LocCalculator.getFileStats(Config.SingleSelectedFiles[i]);
        console.log(`${(i + 1)}. ${Config.SingleSelectedFiles[i]}: ${stats.lines}`);
        total += stats.lines;
      }
      console.log("Total LOC: " + total);
      break;
  }
}

/**
 * Display the help manual. 
 */
const showHelp = () => {
  console.log(
`Usage: node loccal.js <options> <arg1,arg2,arg3...> <Dir/file 1,Dir/file 2,...>
Usage (for individual files): node loccal.js file1,file2,file3,...

    -ae     Calculate LOC for files with these extensions only.
    -ex     Don't calculate LOC for files with these extensions.
    -exf    Don't calculate LOC for these files.
    -exd    Don't calculate LOC for files in these Directories.
    -r      Recursively calculate LOC in sub-directories.
    -v      Be verbosive.
    -c      Don't calculate comments.
    -oc     Only code lines (no comments or empty lines).
    -h      Show help manual

LOC calculator
Version: ${VERSION_NUMBER}`);
}


/**
 * Start the application. 
 */
init();
