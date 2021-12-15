"use strict";

import fs from "fs";
import Utility from "../src/Utility";

/* For Utility.isDirectory(). */
test("is path directory or not", () => {
	expect(Utility.isDirectory(".")).toBeTruthy();
	expect(Utility.isDirectory("./test/test_files/")).toBeTruthy();
	expect(Utility.isDirectory("./test/test_files/test_dir1")).toBeTruthy();
	expect(Utility.isDirectory("./test/test_files/multiline_comments.js")).toBeFalsy();
	expect(Utility.isDirectory("..")).toBeTruthy();
});

/* For Utility.isEmpty(). */
test("is string empty", () => {
	expect(Utility.isEmpty("")).toBe(true);
	expect(Utility.isEmpty("    ")).toBe(true);
	expect(Utility.isEmpty("alksdj   ")).toBe(false);
	expect(Utility.isEmpty("  alksdj")).toBe(false);
	expect(Utility.isEmpty(" alksdj   ")).toBe(false);
});

/* For Utility.trim(). */
test("remove a given character at every index in the string", () => {
	expect(Utility.trim("Hello, World\n", ",")).toBe("Hello World\n");
	expect(Utility.trim("", "")).toBe("");
	expect(Utility.trim("..//\\jfadjfasjfa//sdjfa/..", "jfa")).toBe("..//\\ds//sd/..")
	expect(Utility.trim("..ad// l.. a..kd", ".")).toBe("ad// l akd");
});

/* For Utility.removeComments(). */
test(`remove multi-line comments from a given string 
	and return the number of lines spanned by such comments`, () => {
		let content = fs.readFileSync("./test/test_files/multiline_comments.js").toString();
		expect(Utility.removeComments(content)[0]).toBe(17);
});

/* For Utility.isSingleLineComment(). */
test("if the line is single line comment or not", () => {
	let content = fs.readFileSync("./test/test_files/singleline_comments.js").toString().split("\n");
	expect(Utility.isSingleLineComment(content[0])).toBe(false);
	expect(Utility.isSingleLineComment(content[1])).toBe(false);
	expect(Utility.isSingleLineComment(content[2])).toBe(true);
	expect(Utility.isSingleLineComment(content[3])).toBe(false);
	expect(Utility.isSingleLineComment(content[4])).toBe(true);
	expect(Utility.isSingleLineComment(content[5])).toBe(false);
});
