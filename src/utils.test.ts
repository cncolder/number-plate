import { describe, expect, it } from "vitest";
import {
	expandNumberRange,
	matchIncrementalNumber,
	matchRepeatedNumber,
	matchSearchKeyword,
	matchTripleNumber,
} from "./utils";

describe("utils", () => {
	it("expand number range to array", () => {
		expect(expandNumberRange(["A100BC", "A103BC"])).toEqual([
			"A100BC",
			"A101BC",
			"A102BC",
			"A103BC",
		]);
	});

	it("match search keyword", () => {
		expect(matchSearchKeyword("A11111", "1*111")).toBe(true);
		expect(matchSearchKeyword("A11111", "A11*11")).toBe(true);
	});

	it("match triple number", () => {
		for (const n of ["A11100", "A11110", "A11111", "A01111"]) {
			expect(matchTripleNumber(n)).toBe(true);
		}
	});

	it("match repeated number", () => {
		for (const n of ["A44044", "22333"]) {
			expect(matchRepeatedNumber(n)).toBe(true);
		}
	});

	it("match incremental number", () => {
		for (const n of ["A12300", "A11012", "A12345", "A01321"]) {
			expect(matchIncrementalNumber(n)).toBe(true);
		}
	});
});
