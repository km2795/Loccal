"use strict";

import Config from "../src/Config";
import LocCalculator from "../src/loccal";


test("get line count", () => {
	expect(LocCalculator.getFileStats("./test/test_files/multiline_comments.js").lines).toBe(61);
});

test("get path content", () => {
	let filePathContentExpected = [
		"test/test_files/multiline_comments.js",
		"test/test_files/singleline_comments.js",
		"test/test_files/test_dir1",
		"test/test_files/test_dir2"
	];

	expect(LocCalculator.getPathContent("./test/test_files").toString()).toBe(filePathContentExpected.toString());
});

test("get everything from the path", () => {
	// Function returns the values in these arrays.
	let pathContentListRecursive = [];
	let pathContentListNonRecursive = [];

	let pathContentListRecursiveExpected = [
		"test/test_files/multiline_comments.js", 
		"test/test_files/singleline_comments.js", 
		"test/test_files/test_dir1/test_file1.txt",
		"test/test_files/test_dir1/test_file2.txt",
		"test/test_files/test_dir2/test_file3.txt",
		"test/test_files/test_dir2/test_file4.txt"
	];

	let pathContentListNonRecursiveExpected = [
		"test/test_files/multiline_comments.js", 
		"test/test_files/singleline_comments.js"
	];

	// Call the function. 
	LocCalculator.getWholePathContent("./test/test_files", pathContentListRecursive, false);
	LocCalculator.getWholePathContent("./test/test_files", pathContentListNonRecursive, true);

	// Test the output with the expected.
	expect(pathContentListRecursive.toString()).toBe(pathContentListRecursiveExpected.toString());	
	expect(pathContentListNonRecursive.toString()).toBe(pathContentListNonRecursiveExpected.toString());
});


test("consolidate files, calculate the LOC of all those files and summarize the stats", (done) => {
	let pathContent = [];
	let pathContentExpected = { 
		"test/test_files/multiline_comments.js'": 61,
    "test/test_files/singleline_comments.js": 6,
    "test/test_files/test_dir1/test_file1.txt": 1,
    "test/test_files/test_dir1/test_file2.txt": 1,
    "test/test_files/test_dir2/test_file3.txt": 1,
    "test/test_files/test_dir2/test_file4.txt": 1
  };

  // Fetch the files for test.
	LocCalculator.getWholePathContent("./test/test_files", pathContent, false);

	// Calculate LOC for the files.
	LocCalculator.calculateLoc(pathContent, callback);

	// Check the returned value with the expected value.
	function callback(data) {
		expect(data.toString()).toBe(pathContentExpected.toString());
		done();
	}
});

test("check if the file's extension is allowed or not", () => {
	Config.AllowedExtensions = [".json", ".cpp"];
	Config.ExcludedExtensions = ["min.js"];
	expect(LocCalculator.checkExtension("file.min.js")).toBe(false);
	expect(LocCalculator.checkExtension("file.cd.min.js")).toBe(false);
	expect(LocCalculator.checkExtension("file.878.cxx.cpp")).toBe(true);
	expect(LocCalculator.checkExtension("tor.aldkjasdf.283.min.js")).toBe(false);
});

test("check if the file is excluded", () => {
	Config.ExcludedFiles = ["test_file1.txt", "multiline_comments.js"];
	expect(LocCalculator.isFileExcluded("test_file1.txt")).toBe(true);
	expect(LocCalculator.isFileExcluded("test_file2.txt")).toBe(false);
});

test("check if the directory is excluded", () => {
	Config.ExcludedDirectories = ["test_dir1"];
	expect(LocCalculator.isDirectoryExcluded("test_dir1")).toBe(true);
	expect(LocCalculator.isDirectoryExcluded("test_dir2")).toBe(false);
});
