/**
 * Remove Diacritics
 *
 * Removes diacritics and other symbols, like Microsoft Smart Quotes. Meant for sanitizing inputs and messages.
 *
 * Based on: http://stackoverflow.com/questions/286921/efficiently-replace-all-accented-characters-in-a-string
 *
 * @param str The string to remove diacritics from
 *
 * @returns The string without diacritics
 *
 * @example
 * console.log(removeDiacritics("Héllö Wörld"));
 * -> "Hello World"
 */
export function removeDiacritics(str) {
	if (typeof str !== "string") {
		throw TypeError(`Expected a string`);
	}

	for (let i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
		str = str.replace(
			defaultDiacriticsRemovalMap[i].letters,
			defaultDiacriticsRemovalMap[i].base,
		);
	}

	return str;
}

const defaultDiacriticsRemovalMap = [
	// Numbers
	{ base: "0", letters: /[⓪𝟘𝟎𝟢𝟬𝟶０]/gu },
	{ base: "1", letters: /[①𝟙𝟏𝟣𝟭𝟷１]/gu },
	{ base: "2", letters: /[②𝟚𝟐𝟤𝟮𝟸２]/gu },
	{ base: "3", letters: /[③𝟛𝟑𝟥𝟯𝟹３]/gu },
	{ base: "4", letters: /[④𝟜𝟒𝟦𝟰𝟺４]/gu },
	{ base: "5", letters: /[⑤𝟝𝟓𝟧𝟱𝟻５]/gu },
	{ base: "6", letters: /[⑥𝟞𝟔𝟨𝟲𝟼６]/gu },
	{ base: "7", letters: /[⑦𝟟𝟕𝟩𝟳𝟽７]/gu },
	{ base: "8", letters: /[⑧𝟠𝟖𝟪𝟴𝟾８]/gu },
	{ base: "9", letters: /[⑨𝟡𝟗𝟫𝟵𝟿９]/gu },

	// Lowercase Letters
	{ base: "a", letters: /[ⓐ𝕒ａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ𝐚]/gu },
	{ base: "aa", letters: /[ꜳ]/gu },
	{ base: "ae", letters: /[æǽǣ]/gu },
	{ base: "ao", letters: /[ꜵ]/gu },
	{ base: "au", letters: /[ꜷ]/gu },
	{ base: "av", letters: /[ꜹꜻ]/gu },
	{ base: "ay", letters: /[ꜽ]/gu },
	{ base: "b", letters: /[ⓑ𝕓ｂḃḅḇƀƃɓ𝐛]/gu },
	{ base: "c", letters: /[ⓒ𝕔ｃćĉċčçḉƈȼꜿↄ𝐜]/gu },
	{ base: "d", letters: /[ⓓ𝕕ｄḋďḍḑḓḏđƌɖɗꝺ𝐝]/gu },
	{ base: "dz", letters: /[ǳǆ]/gu },
	{ base: "e", letters: /[ⓔ𝕖ｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ𝐞]/gu },
	{ base: "f", letters: /[ⓕ𝕗ｆḟƒꝼ𝐟]/gu },
	{ base: "g", letters: /[ⓖ𝕘ｇǵĝḡğġǧģǥɠꞡᵹꝿ𝐠]/gu },
	{ base: "h", letters: /[ⓗ𝕙ｈĥḣḧȟḥḩḫẖħⱨⱶɥ𝐡]/gu },
	{ base: "hv", letters: /[ƕ]/gu },
	{ base: "i", letters: /[ⓘ𝕚ｉìíîĩīĭïḯỉǐȉȋịįḭɨı𝐢]/gu },
	{ base: "j", letters: /[ⓙ𝕛ｊĵǰɉ𝐣]/gu },
	{ base: "k", letters: /[ⓚ𝕜ｋḱǩḳķḵƙⱪꝁꝃꝅꞣ𝐤]/gu },
	{ base: "l", letters: /[ⓛ𝕝ｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ𝐥]/gu },
	{ base: "lj", letters: /[ǉ]/gu },
	{ base: "m", letters: /[ⓜ𝕞ｍḿṁṃɱɯ𝐦]/gu },
	{ base: "n", letters: /[ⓝ𝕟ｎǹńñṅňṇņṋṉƞɲŉꞑꞥ𝐧]/gu },
	{ base: "nj", letters: /[ǌ]/gu },
	{
		base: "o",
		letters: /[oⓞ𝕠ｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ𝐨]/gu,
	},
	{ base: "oi", letters: /[ƣ]/gu },
	{ base: "ou", letters: /[ȣ]/gu },
	{ base: "oo", letters: /[ꝏ]/gu },
	{ base: "p", letters: /[ⓟ𝕡ｐṕṗƥᵽꝑꝓꝕ𝐩]/gu },
	{ base: "q", letters: /[ⓠ𝕢ｑɋꝗꝙ𝐪]/gu },
	{ base: "r", letters: /[ⓡ𝕣ｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ𝐫]/gu },
	{ base: "s", letters: /[ⓢ𝕤ｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ𝐬]/gu },
	{ base: "t", letters: /[ⓣ𝕥ｔṫẗťṭțţṱṯŧƭʈⱦꞇ𝐭]/gu },
	{ base: "tz", letters: /[ꜩ]/gu },
	{ base: "u", letters: /[ⓤ𝕦ｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ𝐮]/gu },
	{ base: "v", letters: /[ⓥ𝕧ｖṽṿʋꝟʌ𝐯]/gu },
	{ base: "vy", letters: /[ꝡ]/gu },
	{ base: "w", letters: /[ⓦ𝕨ｗẁẃŵẇẅẘẉⱳ𝐰]/gu },
	{ base: "x", letters: /[ⓧ𝕩ｘẋẍ𝐱]/gu },
	{ base: "y", letters: /[ⓨ𝕪ｙỳýŷỹȳẏÿỷẙỵƴɏỿ𝐲]/gu },
	{ base: "z", letters: /[ⓩ𝕫ｚźẑżžẓẕƶȥɀⱬꝣ𝐳]/gu },

	// Uppercase Letters
	{ base: "A", letters: /[Ⓐ𝔸🇦ＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ𝐀]/gu },
	{ base: "AA", letters: /[Ꜳ]/gu },
	{ base: "AE", letters: /[ÆǼǢ]/gu },
	{ base: "AO", letters: /[Ꜵ]/gu },
	{ base: "AU", letters: /[Ꜷ]/gu },
	{ base: "AV", letters: /[ꜸꜺ]/gu },
	{ base: "AY", letters: /[Ꜽ]/gu },
	{ base: "B", letters: /[Ⓑ𝔹🇧ＢḂḄḆɃƂƁ𝐁]/gu },
	{ base: "C", letters: /[Ⓒℂ🇨ＣĆĈĊČÇḈƇȻꜾ𝐂]/gu },
	{ base: "D", letters: /[Ⓓ𝔻🇩ＤḊĎḌḐḒḎĐƋƊƉꝹ𝐃]/gu },
	{ base: "DZ", letters: /[ǱǄ]/gu },
	{ base: "Dz", letters: /[ǲǅ]/gu },
	{ base: "E", letters: /[Ⓔ𝔼🇪ＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ𝐄]/gu },
	{ base: "F", letters: /[Ⓕ𝔽🇫ＦḞƑꝻ𝐅]/gu },
	{ base: "G", letters: /[Ⓖ𝔾🇬ＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ𝐆]/gu },
	{ base: "H", letters: /[Ⓗℍ🇭ＨĤḢḦȞḤḨḪĦⱧⱵꞍ𝐇]/gu },
	{ base: "I", letters: /[Ⓘ𝕀🇮ＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ𝐈]/gu },
	{ base: "J", letters: /[Ⓙ𝕁🇯ＪĴɈ𝐉]/gu },
	{ base: "K", letters: /[Ⓚ𝕂🇰ＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ𝐊]/gu },
	{ base: "L", letters: /[Ⓛ𝕃🇱ＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ𝐋]/gu },
	{ base: "LJ", letters: /[Ǉ]/gu },
	{ base: "Lj", letters: /[ǈ]/gu },
	{ base: "M", letters: /[Ⓜ𝕄🇲ＭḾṀṂⱮƜ𝐌]/gu },
	{ base: "N", letters: /[Ⓝℕ🇳ＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ𝐍]/gu },
	{ base: "NJ", letters: /[Ǌ]/gu },
	{ base: "Nj", letters: /[ǋ]/gu },
	{
		base: "O",
		letters: /[Ⓞ𝕆🇴ＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ𝐎]/gu,
	},
	{ base: "OI", letters: /[Ƣ]/gu },
	{ base: "OO", letters: /[Ꝏ]/gu },
	{ base: "OU", letters: /[Ȣ]/gu },
	{ base: "P", letters: /[Ⓟℙ🇵ＰṔṖƤⱣꝐꝒꝔ𝐏]/gu },
	{ base: "Q", letters: /[Ⓠℚ🇶ＱꝖꝘɊ𝐐]/gu },
	{ base: "R", letters: /[Ⓡℝ🇷ＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ𝐑]/gu },
	{ base: "S", letters: /[Ⓢ𝕊🇸ＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ𝐒]/gu },
	{ base: "T", letters: /[Ⓣ𝕋🇹ＴṪŤṬȚŢṰṮŦƬƮȾꞆ𝐓]/gu },
	{ base: "TZ", letters: /[\uA728]/gu },
	{ base: "U", letters: /[Ⓤ𝕌🇺ＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ𝐔]/gu },
	{ base: "V", letters: /[Ⓥ𝕍🇻ＶṼṾƲꝞɅ𝐕]/gu },
	{ base: "VY", letters: /[Ꝡ]/gu },
	{ base: "W", letters: /[Ⓦ𝕎🇼ＷẀẂŴẆẄẈⱲ𝐖]/gu },
	{ base: "X", letters: /[Ⓧ𝕏🇽ＸẊẌ𝐗]/gu },
	{ base: "Y", letters: /[Ⓨ𝕐🇾ＹỲÝŶỸȲẎŸỶỴƳɎỾ𝐘]/gu },
	{ base: "Z", letters: /[Ⓩℤ🇿ＺŹẐŻŽẒẔƵȤⱿⱫꝢ𝐙]/gu },

	// Breaks /r/n -> /n
	{ base: "\n", letters: /\r\n/gu },

	// Unicode spaces and tabs
	{ base: " ", letters: /[\t\u00A0\u2000-\u200A\u202F\u205F\u3000]/gu },

	// Microsoft smart quotes
	{ base: '"', letters: /[\u201C\u201D\u201E\u201F\u2033\u2036]/gu },
	{ base: "'", letters: /[`\u2018\u2019\u201A\u201B\u2032\u2035]/gu },

	// Dashes
	{ base: "-", letters: /[\u002D\u2010-\u2015\u2212]/gu },

	// Underscores
	{ base: "_", letters: /[\u005F\uFE4D-\uFE4F]/gu },
];
