/**
 * This is just a test module.
 */

"use strict";


/* Module 'a'. */
const a = require("./a");

/* Module 'b'. */
const b = require("./b");

/* Module 'c'. */
const c = require("./c");

/* Initialize A. */
const A = new a();


/* 
 * Calculate the sum of three numbers. 
 */
function testA(c, d, e) {
	// Variable a.
	let a = c;		// Initializing first variable.

	// Variable b.
	let b = d;		// Initializing second variable.

	// Variable c.
	let c = e;		// Initializing third variable.

	// Return the sum.
	return a + b + c;
}

/** 
 * Just initialize an object, and print 
 * any one of its key. 
 */
function testB() {
	// Variable here.
	let a = {
		b: y,
		c: {
			d: {
				e: v,
				f: u
			}
		}
	};

	// Printing the value of one of the keys of the above declared object.
	console.log(a.d.f);
}

/*****
 * Do not run this code.
 *****/
