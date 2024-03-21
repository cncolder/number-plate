/**
 * 展开号码范围
 * @example A100BC ~ A111BC => [A100BC, A101BC, ..., A111BC]
 */
export const expandNumberScope = (numberScope: string[]) => {
	const [start, end] = numberScope;
	const sections = ["", "", "", ""];
	[...start].forEach((char, i) => {
		if (char === end[i]) {
			sections[sections[1] ? 3 : 0] += char;
		} else {
			sections[1] += char;
			sections[2] += end[i];
		}
	});
	const [head, from, to, tail] = sections;
	return Array(Number(to) - Number(from) + 1)
		.fill(0)
		.map((_, i) => head + i.toString().padStart(from.length, "0") + tail);
};

/**
 * 匹配搜索关键字
 * @example AF33*33 => [AF33033, AF33133, ..., AF33933]
 */
export const matchSearchKeyword = (content: string, keyword: string) => {
	return new RegExp(keyword.replace(/[^0-9a-z]/gi, "."), "i").test(content);
};

/**
 * 仅数字
 * @example 12345
 */
export const matchNumberOnly = (content: string) => {
	return /\d{5}/.test(content);
};

/**
 * 五连号
 * @example 55555
 */
export const matchPentaNumber = (content: string) => {
	return /([\d])\1{4,}/.test(content);
};

/**
 * 四连号
 * @example 4444
 */
export const matchQuadraNumber = (content: string) => {
	return /([\d])\1{3,}/.test(content);
};

/**
 * 三连号
 * @example 333
 */
export const matchTripleNumber = (content: string) => {
	return /([\d])\1{2,}/.test(content);
};

/**
 * 递增减
 * @example 123 9876
 */
export const matchIncrementalNumber = (content: string) => {
	return /((?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9))|(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0))){2,}\d/.test(
		content,
	);
};
