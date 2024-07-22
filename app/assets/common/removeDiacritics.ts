interface DiacriticsMap {
	base: string;
	letters: RegExp;
}

/**
 * Remove Diacritics
 *
 * Removes diacritics and other symbols, like Microsoft Smart Quotes. Meant for sanitizing inputs and messages.
 *
 * Based on:  https://stackoverflow.com/questions/286921  https://stackoverflow.com/questions/990904
 *
 * @param str - The string to remove diacritics from
 *
 * @returns The string without diacritics
 *
 * @example
 * console.log(removeDiacritics("Héllö Wörld"));
 * -> "Hello World"
 */
export function removeDiacritics(str: string): string {
	if (typeof str !== "string") {
		throw new TypeError(`removeDiacritics(str) : 'str' must be a string.`);
	}

	// The bulk of the cleanup
	str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");

	for (const map of defaultDiacriticsRemovalMap) {
		str = str.replace(map.letters, map.base);
	}

	return str;
}

const defaultDiacriticsRemovalMap: DiacriticsMap[] = [
	// Numbers
	{ base: "0", letters: /[⓪𝟘𝟎𝟢𝟬𝟶０⁰]/gu },
	{ base: "1", letters: /[①𝟙𝟏𝟣𝟭𝟷１¹߁]/gu },
	{ base: "2", letters: /[②𝟚𝟐𝟤𝟮𝟸２²]/gu },
	{ base: "3", letters: /[③𝟛𝟑𝟥𝟯𝟹３³]/gu },
	{ base: "4", letters: /[④𝟜𝟒𝟦𝟰𝟺４⁴]/gu },
	{ base: "5", letters: /[⑤𝟝𝟓𝟧𝟱𝟻５⁵]/gu },
	{ base: "6", letters: /[⑥𝟞𝟔𝟨𝟲𝟼６⁶]/gu },
	{ base: "7", letters: /[⑦𝟟𝟕𝟩𝟳𝟽７⁷]/gu },
	{ base: "8", letters: /[⑧𝟠𝟖𝟪𝟴𝟾８⁸]/gu },
	{ base: "9", letters: /[⑨𝟡𝟗𝟫𝟵𝟿９⁹]/gu },

	// Lowercase Letters
	{ base: "a", letters: /[ⓐ𝕒𝖆ａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ𝐚ᵃᵄᵅ]/gu },
	{ base: "b", letters: /[ⓑ𝕓𝖇ｂḃḅḇƀƃɓ𝐛ᵇᵝ]/gu },
	{ base: "c", letters: /[ⓒ𝕔𝖈ｃćĉċčçḉƈȼꜿↄ𝐜ᵓ]/gu },
	{ base: "d", letters: /[ⓓ𝕕𝖉ｄḋďḍḑḓḏđƌɖɗꝺ𝐝ᵈ]/gu },
	{ base: "e", letters: /[ⓔ𝕖𝖊ｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ𝐞ᵉᵊ]/gu },
	{ base: "f", letters: /[ⓕ𝕗𝖋ｆḟƒꝼ𝐟]/gu },
	{ base: "g", letters: /[ⓖ𝕘𝖌ｇǵĝḡğġǧģǥɠꞡᵹꝿ𝐠ᵍ]/gu },
	{ base: "h", letters: /[ⓗ𝕙𝖍ｈĥḣḧȟḥḩḫẖħⱨⱶɥ𝐡]/gu },
	{ base: "i", letters: /[ⓘ𝕚𝖎ｉìíîĩīĭïḯỉǐȉȋịįḭɨı𝐢ᵎ]/gu },
	{ base: "j", letters: /[ⓙ𝕛𝖏ｊĵǰɉ𝐣]/gu },
	{ base: "k", letters: /[ⓚ𝕜𝖐ｋḱǩḳķḵƙⱪꝁꝃꝅꞣ𝐤ᵏ]/gu },
	{ base: "l", letters: /[ⓛ𝕝𝖑ｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ𝐥]/gu },
	{ base: "m", letters: /[ⓜ𝕞𝖒ｍḿṁṃɱɯ𝐦ᵐᵚ]/gu },
	{ base: "n", letters: /[ⓝ𝕟𝖓ｎǹńñṅňṇņṋṉƞɲŉꞑꞥ𝐧ᵑ]/gu },
	{
		base: "o",
		letters: /[ⓞ𝕠𝖔ｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ𝐨ᵒ]/gu,
	},
	{ base: "p", letters: /[ⓟ𝕡𝖕ｐṕṗƥᵽꝑꝓꝕ𝐩ᵖ]/gu },
	{ base: "q", letters: /[ⓠ𝕢𝖖ｑɋꝗꝙ𝐪]/gu },
	{ base: "r", letters: /[ⓡ𝕣𝖗ｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ𝐫]/gu },
	{ base: "s", letters: /[ⓢ𝕤𝖘ｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ𝐬]/gu },
	{ base: "t", letters: /[ⓣ𝕥𝖙ｔṫẗťṭțţṱṯŧƭʈⱦꞇ𝐭ᵗ]/gu },
	{ base: "u", letters: /[ⓤ𝕦𝖚ｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ𝐮ᵘ]/gu },
	{ base: "v", letters: /[ⓥ𝕧𝖛ｖṽṿʋꝟʌ𝐯ᵛᵞ]/gu },
	{ base: "w", letters: /[ⓦ𝕨𝖜ｗẁẃŵẇẅẘẉⱳ𝐰]/gu },
	{ base: "x", letters: /[ⓧ𝕩𝖝ｘẋẍ𝐱ᵡ]/gu },
	{ base: "y", letters: /[ⓨ𝕪𝖞ｙỳýŷỹȳẏÿỷẙỵƴɏỿ𝐲]/gu },
	{ base: "z", letters: /[ⓩ𝕫𝖟ｚźẑżžẓẕƶȥɀⱬꝣ𝐳]/gu },

	// Uppercase Letters
	{ base: "A", letters: /[Ⓐ𝔸𝕬🇦ＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ𝐀ᴬ]/gu },
	{ base: "B", letters: /[Ⓑ𝔹𝕭🇧ＢḂḄḆɃƂƁ𝐁ᴮᴯ]/gu },
	{ base: "C", letters: /[Ⓒℂ𝕮🇨ＣĆĈĊČÇḈƇȻꜾ𝐂]/gu },
	{ base: "D", letters: /[Ⓓ𝔻𝕯🇩ＤḊĎḌḐḒḎĐƋƊƉꝹ𝐃ᴰ]/gu },
	{ base: "E", letters: /[Ⓔ𝔼𝕰🇪ＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ𝐄ᴱᴲᵋᵌ]/gu },
	{ base: "F", letters: /[Ⓕ𝔽𝕱🇫ＦḞƑꝻ𝐅]/gu },
	{ base: "G", letters: /[Ⓖ𝔾𝕲🇬ＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ𝐆ᴳ]/gu },
	{ base: "H", letters: /[Ⓗℍ𝕳🇭ＨĤḢḦȞḤḨḪĦⱧⱵꞍ𝐇ᴴ]/gu },
	{ base: "I", letters: /[Ⓘ𝕀𝕴🇮ＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ𝐈ᴵ]/gu },
	{ base: "J", letters: /[Ⓙ𝕁𝕵🇯ＪĴɈ𝐉ᴶ]/gu },
	{ base: "K", letters: /[Ⓚ𝕂𝕶🇰ＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ𝐊ᴷ]/gu },
	{ base: "L", letters: /[Ⓛ𝕃𝕷🇱ＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ𝐋ᴸ]/gu },
	{ base: "M", letters: /[Ⓜ𝕄𝕸🇲ＭḾṀṂⱮƜ𝐌ᴹ]/gu },
	{ base: "N", letters: /[Ⓝℕ𝕹🇳ＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ𝐍ᴺᴻ]/gu },
	{
		base: "O",
		letters: /[Ⓞ𝕆𝕺🇴ＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ𝐎ᴼ]/gu,
	},
	{ base: "P", letters: /[Ⓟℙ𝕻🇵ＰṔṖƤⱣꝐꝒꝔ𝐏ᴾ]/gu },
	{ base: "Q", letters: /[Ⓠℚ𝕼🇶ＱꝖꝘɊ𝐐]/gu },
	{ base: "R", letters: /[Ⓡℝ𝕽🇷ＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ𝐑ᴿ]/gu },
	{ base: "S", letters: /[Ⓢ𝕊𝕾🇸ＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ𝐒]/gu },
	{ base: "T", letters: /[Ⓣ𝕋𝕿🇹ＴṪŤṬȚŢṰṮŦƬƮȾꞆ𝐓ᵀ]/gu },
	{ base: "U", letters: /[Ⓤ𝕌𝖀🇺ＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ𝐔ᵁ]/gu },
	{ base: "V", letters: /[Ⓥ𝕍𝖁🇻ＶṼṾƲꝞɅ𝐕]/gu },
	{ base: "W", letters: /[Ⓦ𝕎𝖂🇼ＷẀẂŴẆẄẈⱲ𝐖ᵂ]/gu },
	{ base: "X", letters: /[Ⓧ𝕏𝖃🇽ＸẊẌ𝐗]/gu },
	{ base: "Y", letters: /[Ⓨ𝕐𝖄🇾ＹỲÝŶỸȲẎŸỶỴƳɎỾ𝐘]/gu },
	{ base: "Z", letters: /[Ⓩℤ𝖅🇿ＺŹẐŻŽẒẔƵȤⱿⱫꝢ𝐙]/gu },

	// Special Characters Lowercase
	{ base: "aa", letters: /[ꜳ]/gu },
	{ base: "ae", letters: /[æǽǣ]/gu },
	{ base: "ao", letters: /[ꜵ]/gu },
	{ base: "au", letters: /[ꜷ]/gu },
	{ base: "av", letters: /[ꜹꜻ]/gu },
	{ base: "ay", letters: /[ꜽ]/gu },
	{ base: "dz", letters: /[ǳǆ]/gu },
	{ base: "hv", letters: /[ƕ]/gu },
	{ base: "lj", letters: /[ǉ]/gu },
	{ base: "nj", letters: /[ǌ]/gu },
	{ base: "oi", letters: /[ƣ]/gu },
	{ base: "ou", letters: /[ȣ]/gu },
	{ base: "oo", letters: /[ꝏ]/gu },
	{ base: "tz", letters: /[ꜩ]/gu },
	{ base: "vy", letters: /[ꝡ]/gu },

	// Special Characters Uppercase
	{ base: "AA", letters: /[Ꜳ]/gu },
	{ base: "AE", letters: /[ÆǼǢ]/gu },
	{ base: "AO", letters: /[Ꜵ]/gu },
	{ base: "AU", letters: /[Ꜷ]/gu },
	{ base: "AV", letters: /[ꜸꜺ]/gu },
	{ base: "AY", letters: /[Ꜽ]/gu },
	{ base: "DZ", letters: /[ǱǄ]/gu },
	{ base: "Dz", letters: /[ǲǅ]/gu },
	{ base: "LJ", letters: /[Ǉ]/gu },
	{ base: "Lj", letters: /[ǈ]/gu },
	{ base: "NJ", letters: /[Ǌ]/gu },
	{ base: "Nj", letters: /[ǋ]/gu },
	{ base: "OI", letters: /[Ƣ]/gu },
	{ base: "OO", letters: /[Ꝏ]/gu },
	{ base: "OU", letters: /[Ȣ]/gu },
	{ base: "TZ", letters: /[Ꜩ]/gu },
	{ base: "VY", letters: /[Ꝡ]/gu },

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
