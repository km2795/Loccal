"use strict";

const Config = {
  /* Allowed file extensions. If none, all are allowed. */
  AllowedExtensions: [],

  /* When none is allowed, that is all are allowed, then excluded ones are not counted. */
  ExcludedExtensions: [],

  /* Which files are not included in the counting procedure. */
  ExcludedFiles: [],

  /* Which directories are not to be scanned, in recursive mode. */
  ExcludedDirectories: [],

  /* Which is the main directory to start scanning from. */
  SelectedDirectory: "",

  /* Which files are to be included in the single file mode. */
  SingleSelectedFiles: [],

  /* Level of information to display. */
  DisplayLevel: 0,

  /* Do not include the comments. */
  NoComments: 0,

  /* Do not include the comments as well as the empty lines. */
  CleanLines: 0,

  /* Total LOC. */
  TotalLoc: 0,

  /* Total Empty Lines. */
  TotalEmptyLines: 0,

  /* Total count of comments. */
  TotalComments: {
    Single: 0,
    Multi: 0
  }
};

export default Config;
