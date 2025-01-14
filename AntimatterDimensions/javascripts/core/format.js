function letter(power, str) {
	const len = str.length;
	let ret = ''
	power = Math.floor(power / 3)
	let skipped = Math.floor(Math.log10(power * (len - 1) + 1) / Math.log10(len)) - 7
	if (skipped < 4) skipped = 0
	else power = Math.floor((power - (Math.pow(len, skipped) - 1) / (len - 1) * len)/Math.pow(len, skipped))
	while (power > 0) {
		ret = str[(power - 1) % len] + ret
		power = Math.ceil(power / len) - 1
	}
	if (skipped) ret += "[" + skipped + "]"
	return ret
}

var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];

function standardize(x, aas) {
	if (!aas) x = x.toUpperCase()
	return x
}

function getAbbreviation(e, aas) {
	var result = ''
	e = Math.floor(e / 3) - 1;
	e2 = 0
	while (e > 0) {		
		var partE = e % 1000
		if (partE > 0) result = toTier1Abb(partE, e2, aas) + (result ? '-' + result : '')
		e = Math.floor(e / 1000)
		e2++
	}
	return result
}

function getShortAbbreviation(e, aas) {
	var result = ''
	var id = Math.floor(e / 3 - 1)
	var log = Math.floor(Math.log10(id))
	var step = Math.max(Math.floor(log / 3 - 2), 0)
	id = Math.round(id / Math.pow(10, Math.max(log - 6, 0))) * Math.pow(10, Math.max(log - 6, 0) % 3)
	while (id > 0) {		
		var partE = id % 1000
		if (partE > 0) result = toTier1Abb(partE, step, aas) + (result ? '-' + result : '')
		id = Math.floor(id / 1000)
		step++
	}
	return result
}

function toTier1Abb(t1, t2, aas) {
	let prefixes = aas ? [
		["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"],
		["", "De", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"],
		["", "Ce", "Dc", "Tc", "Qe", "Qu", "Se", "Si", "Oe", "Ne"],
	] : [
		['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
		['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
		['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']
	]
	let o = t1 % 10
	let t = Math.floor(t1 / 10) % 10
	let h = Math.floor(t1 / 100) % 10

	let r = ""
	if (player.options.standard.useMyr && !player.options.standard.useTam && t1 >= 10 && t2 == 1) {
		if (t1 >= 20) r = prefixes[0][t] + prefixes[1][h]
		r += standardize("Myr", aas)
		if (o > 0) r += "-" + (o > 1 ? prefixes[0][o] : "") + standardize("Mi", aas)
	} else {
		if (t1 > 1 || t2 == 0) {
			if (h > 0 && player.options.standard.useTam) {
				if (h >= 2) r += prefixes[2][h]
				if (o > 0 || t > 0) {
					r += prefixes[1][t]
					r += prefixes[0][o]
					if (h >= 2) r += prefixes[2][1]
				}
			} else r = prefixes[0][o] + prefixes[1][t] + prefixes[2][h]
		}
		r += toTier2Abb(t2, aas)
	}

	return r
}

function toTier2Abb(t2, aas) {
	if (!t2) return ""

	let tam = player.options.standard.useTam
	let prefixes2 = tam ?
		["", "M", "D", "Tr", "Te", "P", "H", "Hp", "Oc", "En"]
	: [
		["", "Mi", "Mc", "Na", aas ? "Pi" : "Pc", aas ? "Fem" : "Fm", "At", "Zep", "Yo", "Xe"],
		["", "Me", "Du", "Tr", "Te", "Pe", "He", "Hp", "Ot", "En"],
		["", "C", "Ic", "TCn", "TeC", "PCn", "HCn", "HpC", "OCn", "ECn"],
		["", "Hc", "DHe", "THt", "TeH", "PHc", "HHe", "HpH", "OHt", "EHc"]
	]
	// Now supporting Tamara's illions!
	// https://tamaramacadam.me/maths/largenumbers/illions.html

	let o = t2 % 10
	let t = Math.floor(t2 / 10) % 10
	let h = Math.floor(t2 / 100) % 10

	let r = ''

	if (tam) {
		if (h > 0) {
			if (h >= 2) r += prefixes2[h]
			r += "c"
		}
		if (t > 0) {
			if (t >= 2) r += prefixes2[t]
			r += "d"
		}
		r += prefixes2[o] + "n"
	} else {
		if (t2 < 10 && !tam) return standardize(prefixes2[0][t2], aas)
		if (t == 1 && o == 0) r += "Vc"
		else r += prefixes2[1][o] + prefixes2[2][t]
		r += prefixes2[3][h]
	}

	return standardize(r, aas)
}

var timeDivisions = ["minute", "hour", "day", "week", "month", "year"]
var timeValues = {
	year: 31556952,
	month: 2629746,
	week: 604800,
	day: 86400,
	hour: 3600,
	minute: 60,
	second: 1
}
function timePadEnd(value) {
	return (value < 10 ? "0" : "") + value
}
function getTimeAbbreviation(seconds) {
	var data = {second: seconds}
	for (var d = 5; d >= 0; d--) {
		var division = timeDivisions[d]
		data[division] = Math.floor(data.second / timeValues[division])
		data.second -= data[division] * timeValues[division]
	}
	if (data.year >= 100) {	
		if (player.options.commas === "Commas") {
			if (data.year >= 1e9) return formatValue("Mixed scientific", data.year, 3, 3) + " years"
		} else {
			if (data.year >= 1e5) return formatValue(player.options.commas, data.year, 3, 3) + " years"
		}
		return getFullExpansion(data.year) + " years"
	}
	if (data.year >= 10) return data.year + " years, " + data.month + "m"
	if (data.year) return data.year + " year" + (data.year == 1 ? "" : "s") + ", " + data.month + "m & " + data.week + "w"
	if (data.month) return data.month + " month" + (data.month == 1 ? "" : "s") + ", " + data.week + "w & " + data.day + "d"
	if (data.week) return data.week + " week" + (data.week == 1 ? "" : "s") + ", " + data.day + " day" + (data.day == 1 ? "" : "s") + " & " + data.hour + "h"
	if (data.day) return data.day + " day" + (data.day == 1 ? "" : "s") + " & " + data.hour + ":" + timePadEnd(data.minute)
	if (data.hour) return data.hour + ":" + timePadEnd(data.minute) + ":" + timePadEnd(data.second)
	if (data.minute) return data.minute + ":" + timePadEnd(data.second)
	return data.second + " secs"
}

const inflog = Math.log10(Number.MAX_VALUE)
function formatValue(notation, value, places, placesUnder1000, noInf) {
	if (notation === "Blind") return ""
	if (notation === "Same notation") notation = player.options.notation
	if (notation === 'Iroha' && (onPostBreak() || Decimal.lt(value, getLimit()) || noInf)) return iroha(value, 5)
	if (Decimal.eq(value, 1/0)) return "Infinite"
	if ((onPostBreak() || Decimal.lt(value, getLimit()) || noInf) && (Decimal.gte(value,1000))) {
		if (notation === "AF2019") {
			var log = Decimal.log10(value)
			var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !"
			var translated = [10, 51, 53, 44, 47, 62, 15, 50, 50, 47, 54, 63]
			var result = ""
			for (var c = 0; c < 12; c++) result += digits[Math.floor(translated[c] + Math.max(Math.log10(Number.MAX_VALUE) * (c + 1) - log * (c + 2), 0)) % 64]
			return result
		}
		if (notation === "Hexadecimal" || notation === "Base-64") {
			var base = notation === "Hexadecimal" ? 16 : 64
			value = Decimal.pow(value, 1 / Math.log10(base))
			var mantissa = Math.pow(value.m, Math.log10(base))
			var power = value.e
			if (mantissa > base - Math.pow(base, -2) / 2) {
				mantissa = 1
				power++
			}
			var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/"
			mantissa = digits[Math.floor(mantissa)].toString() + '.' + digits[Math.floor(mantissa * base) % base].toString() + digits[Math.floor(mantissa * Math.pow(base, 2)) % base].toString()
			if (power > 100000 && !(player.options.commas === "Commas")) return mantissa + "e" + formatValue(player.options.commas, power, 3, 3)
			else {
				if (power >= Math.pow(base, 12)) return mantissa + "e" + formatValue(player.options.notation, power, 3, 3)
				var digit = 0
				var result = ''
				var temp = power
				while (power > 0) {
					result = digits[power % base].toString() + (temp > 1e5 && digit > 0 && digit % 3 < 1 ? ',' : '') + result
					power = Math.floor(power / base)
					digit++
				}
				return mantissa + "e" + result;
			}
		}
		if (notation === "Spazzy") {
			value = E(value)
			var log = value.log10()
			var sin = Math.sin(log)
			var cos = Math.cos(log)
			var result
			if (sin < 0) result = "|-" + formatValue(player.options.spazzy.subNotation, value.times(-sin), 2, 2)
			else result = "|" + formatValue(player.options.spazzy.subNotation, value.times(sin), 2, 2)
			if (cos < 0) result += "-" + formatValue(player.options.spazzy.subNotation, value.times(-cos), 2, 2)+"i|"
			else result += "+" + formatValue(player.options.spazzy.subNotation, value.times(cos), 2, 2)+"i|"
			return result
		}
		if (notation === "AF5LN") {
			value = E(value)
			var progress = Math.round(Math.log10(value.add(1).log10() + 1)/Math.log10(Number.MAX_VALUE) * 11881375)
			var uppercased = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			var result = ""
			for (l = 0; l < 5; l++) {
				var pos = Math.floor(progress / Math.pow(26, l)) % 26
				result = uppercased.slice(pos, pos + 1) + result
			}
			return result
		}
		if (notation === "Hyperscientific" || notation === "Layered scientific" || notation === "Layered logarithm" || notation === "Tetrational scientific" || notation === "Hyper-E") {
			value = E(value)
			var e = value
			var f = 0
			var bump = player.options.hypersci.bump || 10
			while (e.gt(bump)) {
				e = E(e.log10())
				f ++
			}
			e = e.toFixed(2 + f)
			if (e >= bump) {
				e = Math.log10(e).toFixed(3 + f)
				f++
			}
			if (notation === "Hyperscientific") return e + "F" + f
			if (notation === "Layered scientific") return "e".repeat(f - 1) + Math.pow(10, e % 1).toFixed(1 + f) + "e" + Math.floor(e)
			if (notation === "Layered logarithm") return "e".repeat(f) + e
			if (notation === "Tetrational scientific") return "10^^" + f + ";" + e
			if (notation === "Hyper-E") return "E" + e + "#" + f
		}
		if (value instanceof Decimal) {
			var power = value.e
			var matissa = value.mantissa
		} else {
			var power = Math.floor(Math.log10(value))
			var matissa = value / Math.pow(10, power)
		}
		var explained = (notation === "Explained scientific" || notation === "Explained engineering" || notation === "Explained logarithm")
		var e = explained ? "10^" : "e"
		var e_m = explained ? "*" : ""
		if ((notation === "Mixed scientific" && power >= 33) || notation === "Scientific" || notation === "Explained scientific" || (notation === "Maximus Standard" && power < 1e3)) {
			if (player.options.scientific !== undefined && player.options.scientific.significantDigits !== undefined) places = player.options.scientific.significantDigits - 1
			places = Math.min(places, 9 - Math.floor(Math.log10(power)) - 1)
			if (places >= 0) {
				matissa = matissa.toFixed(places)
				if (matissa >= 10) {
					matissa = (1).toFixed(places);
					power++;
				}
			} else matissa = ""
			if (power > 100000) {
				if (player.options.commas != "Commas") power = formatValue(player.options.commas, power, 3, 3)
				else if (power < 1e9) power = getFullExpansion(power)
				else power = formatValue("Mixed scientific", power, 3, 3)
			}
			return (matissa ? matissa + e_m : "") + e + power
		}
		if (notation === "Psi") {
			return formatPsi(matissa, power)
		}
		if (notation === "Greek" || notation === "Morse code" || notation === "Symbols" || notation === "Lines" || notation === "Simplified Written") {
			places = Math.min(places, 8 - Math.floor(Math.log10(power)))
			if (places < 1) matissa = 0
			else if (matissa >= 10 - Math.pow(10, -places) / 2) {
				matissa = Math.pow(10,places)
				power -= places + 1
			} else {
				matissa = Math.round(matissa * Math.pow(10, places))
				power -= places
			}
			if (power > 1e5 && player.options.commas !== "Commas") power = formatValue(player.options.commas, power, 3, 3)
			else power = convTo(notation, power)
			if (notation == "Simplified Written") return "(" + power + ") " + convTo(notation, matissa)
			return convTo(notation, matissa) + (notation == "Symbols" ? '-' : "e") + power
		}
		if (notation === "Layered Symbols") return ""
		if (notation === "Maximus Standard") {
			var slog = Math.floor(Math.log10(power))
			var slog3 = Math.floor(slog / 3)
			var log10 = power / Math.pow(10, 3 * slog3)
			var mant = log10.toFixed(3 - slog + slog3 * 3)
			if (mant >= 1e3) {
				mant = (1).toFixed(3);
				slog3++
			}
			return "MXS-" + FormatList[slog3] + "^" + mant
		}
		if (notation === "Infinity") {
			const inflog = Math.log10(Number.MAX_VALUE)
			const pow = Decimal.log10(value)
			var reduced = pow / inflog
			if (reduced < 1000) var infPlaces = 4
			else var infPlaces = 3
			if (player.options.commas === "Commas") {
				if (reduced>=1e9) return formatValue("Mixed scientific", reduced, 3, 3) + "∞"
				var splits=reduced.toFixed(Math.max(infPlaces, places)).split(".")
				return splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + splits[1] + "∞"
			} else {
				if (reduced>=1e5) return formatValue(player.options.commas, reduced, 3, 3) + "∞"
				return reduced.toFixed(Math.max(infPlaces, places))+"∞"
			}
		}
		if (notation === "Game percentages") {
			return (Math.log10(Decimal.log10(value)) / Math.log10(tmp.ngp3 ? 1e18 : 3.5e8) * 100).toFixed(4) + '%'
		}
		if (notation === "Engineering" || notation === "Mixed engineering" || notation === "Explained engineering") pow = power - (power % 3)
		else pow = power
		if (pow > 100000) {
			if (player.options.commas !== "Commas") pow = formatValue(player.options.commas, pow, 3, 3)
			else if (pow >= 1e9) pow = formatValue("Mixed scientific", pow, 3, 3)
			else pow = getFullExpansion(pow);
		}

		if (notation === "Logarithm" || notation === "Explained logarithm" || (notation === "Mixed logarithm" && power > 32) || notation === 'Iroha') {
			var base = Math.max(player.options.logarithm.base, 1.01)
			var prefix
			if (base == 10) {
				power = Decimal.log10(value)
				prefix = e
			} else {
				power = E(value).log(base)
				if (base >= 1e3) var prefix = formatValue("Mixed scientific", base, 2, 0)
				else prefix = base
				prefix += "^"
			}
			if (power > 100000) {
				if (player.options.commas === "Logarithm") {
					if (base == 10) return e + e + Math.log10(power).toFixed(3)
					return prefix + prefix + (Math.log10(power) / Math.log(base)).toFixed(3)
				}
				else if (player.options.commas !== "Commas") return prefix + formatValue(player.options.commas, power, 3, 3)
				else if (power >= 1e9) return prefix + formatValue("Mixed scientific", power, 3, 3)
				else return prefix + power.toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			}
			return prefix + power.toFixed(places)
		}

		if (notation === "Brackets") {
		  var table = [")", "[", "{", "]", "(", "}"];
		  var log6 = Math.LN10 / Math.log(6) * Decimal.log10(value);
		  if (log6 >= 1e9) return "e" + formatValue("Brackets", log6)
		  var wholePartOfLog = Math.floor(log6);
		  var decimalPartOfLog = log6 - wholePartOfLog;
		  //Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
		  var decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
		  var string = "";
		  while (wholePartOfLog >= 6) {
			var remainder = wholePartOfLog % 6;
			wholePartOfLog -= remainder;
			wholePartOfLog /= 6;
			string = table[remainder] + string;
		  }
		  string = "e" + table[wholePartOfLog] + string + ".";
		  string += table[Math.floor(decimalPartTimes36 / 6)];
		  string += table[decimalPartTimes36 % 6];
		  return string;
		}
		if (notation == "Tetration") {
		  var base = player.options.tetration.base
		  var count = -1;
		  if (base >= 1e15) var prefix = formatValue("Scientific", base, 2, 0)
		  else if (base >= 1e3) var prefix = formatValue("Mixed scientific", base, 2, 0)
		  else var prefix = base
		  while (value > 1) {
			value = E(value).log(base)
			count++;
		  }
		  return prefix + "⇈" + (value + count).toFixed(Math.max(places, 0, Math.min(count-1, 4)));
		}

		if (notation === "Myriads") return getMyriadStandard(value, places)
		if (notation === "Time") {
			if (power >= 3e9 + 3) return getTimeAbbreviation(power / 3)
			matissa = (matissa * Math.pow(10, power % 3)).toFixed(Math.max(places - power % 3, 0))
			if (parseFloat(matissa) == 1e3) {
				matissa = (1).toFixed(places)
				power += 3
			}
			return matissa + " " + getTimeAbbreviation(Math.floor(power / 3))
		}

		if (matissa >= 1000) {
			matissa /= 1000;
			power++;
		}
		places = Math.min(places, 8 - Math.floor(Math.log10(power)))
		if (places >= 0) {
			matissa = (matissa * Decimal.pow(10, power % 3)).toFixed(places)
			if (matissa >= 1e3) {
				power += 3
				places = Math.min(places, 8 - Math.floor(Math.log10(power)))
				matissa = (1).toFixed(places)
			}
		}
		if (places < 0) matissa = ""

		if (notation === "Standard" || notation === "AAS" || notation === "Mixed scientific" || notation === "Mixed logarithm") {
			let aas = notation === "AAS"
			if (power <= 303) return matissa + " " + FormatList[(power - (power % 3)) / 3];
			else if (power >= 3e9 + 3) return getShortAbbreviation(power, aas) + "s";
			else return matissa + " " + getAbbreviation(power, aas);
		} else if (notation === "Mixed engineering") {
			if (power <= 33) return matissa + " " + FormatList[(power - (power % 3)) / 3];
			else return (matissa + e_m + e + pow);
		} else if (notation === "Engineering" || notation === "Explained engineering") {
			if (power >= 1e9) return e + pow
			return (matissa + e_m + e + pow);
		} else if (notation === "Letters") {
			return matissa + letter(power, 'abcdefghijklmnopqrstuvwxyz');
		} else if (notation === "Emojis") {
			return matissa + letter(power, ['😠', '🎂', '🎄', '💀', '🍆', '🐱', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡'])
		} else if (notation === "Country Codes") {
			return matissa + letter(power, [" GR", " IL", " TR", " NZ", " HK", " SG", " DK", " NO", " AT", " MX", " ID", " RU", " SE", " BE", " BR", " NL", " TW", " CH", " ES", " IN", " KR", " AU", " CA", " IT", " FR", " DE", " UK", " JP", " CN", " US"])
		} else if (notation === "Fonster") {
			return matissa + FONSTER.FORMAT("abb", Math.floor(power / 3))
		} else if (notation === "Fonster (Words)") {
			if (power >= 3e9 + 3) return FONSTER.FORMAT("", Math.floor(power / 3))
			else return matissa + " " + FONSTER.FORMAT("", Math.floor(power / 3))
		}

		else {
			if (power > 100000  && player.options.commas === "Commas") power = power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			return "1337 H4CK3R"
		}
	} else if (value !== undefined && Decimal.lt(value, 1000)) {
		return (value).toFixed(placesUnder1000);
	} else {
		return "Infinite";
	}
}

function formatPsi(mantissa,power){
	if (!player.options.psi) {
		player.options.psi = {}
		player.options.psi.chars = 17
		player.options.psi.precision = 12
		player.options.psi.letter = []
		player.options.psi.forceNumbers = false
		player.options.psi.args = Infinity
		player.options.psi.side = "r"
		player.options.psi.maxletters = 1
	}
	if (arguments.length < 2){
		power = Math.floor(Math.log10(mantissa))
	}
	function log(x, y, z, w) {
		if (window.psidebug) {
			console.log(x, y, z, w)
		}
	}
	function equal(l1, l2) {
		if (l1.length != l2.length) {
			return false
		}
		for (var i = 0; i < l1.length; i++) {
			if (l1[i] != l2[i]) {
				return false
			}
		}
		return true
	}
	function letter(l) {
		var letters = {"1" : "E", "2" : "F", "3" : "G", "4" : "H", "0,1" : "J"}
		if (letters[l]) {
			return letters[l]
		} else {
			return "(" + l + ")|"
		}
	}
	function numbersDone(ns, ls) {
		if (player.options.psi.letter.length == 0) {
			return ns[0] < 10
		} else {
			return ns[0] < 10 || lettersDone(ls)
		}
	}
	function lettersDone(ls) {
		if (player.options.psi.letter.length == 0) {
			return ls.length <= player.options.psi.maxletters
		} else {
			return ls.length == 1 && equal(ls[0], player.options.psi.letter)
		}
	}
    log(mantissa, power)
    var precision = player.options.psi.precision
    if (power == 0 && player.options.psi.letter.length == 0) {
	    var letters = []
	    var numbers = [mantissa]
	} else {
	    var letters = [[1]]
	    var numbers = [power, "-", mantissa]

	}
    while (!lettersDone(letters) || !numbersDone(numbers,letters)) {
    	//reduce numbers[0]
    	while (!numbersDone(numbers, letters)) {
	    	log(letters.map(letter), numbers, "reduce")
    		var n = numbers.shift()
    		numbers.unshift(Math.floor(Math.log10(n)), "-", n)
    		letters.push([1])
    	}
    	//simplify letters
    	if(!lettersDone(letters)) {
	    	log(letters.map(letter), numbers, "simplify")
    		var lastletter = letters.pop()
    		var count = 1
    		while (letters.length > 0 && equal(letters[letters.length - 1], lastletter)) {
    			letters.pop()
    			count++
    		}
    		numbers.unshift(count, "-")
    		lastletter[0]++
    		letters.push(lastletter)
    	}
    }
	//remove extra terms
	//((numbers[numbers.length-2]=="-"&&Math.log(numbers[numbers.length-1])%1==0)||(numbers[numbers.length-2]=="$"&&(Math.log(numbers[numbers.length-1])/2)%1==0))
	while(numbers.length > 2 && Math.log10(numbers[numbers.length - 1]) % 1 == 0) {
    	log(letters.map(letter), numbers, "remove")
		numbers.pop()
		numbers.pop()
	}
    log(letters.map(letter), numbers, "predone")
    while (numbers.length >= 2 * player.options.psi.args + 1) {
    	var arg2 = numbers.pop()
    	var op = numbers.pop()
    	var arg1 = numbers.pop()
    	if (op == "-") {
    		numbers.push(arg1 + Math.log10(arg2) % 1)
    	}
    }
    log(letters.map(letter),numbers,"done")
    for (var i = 0; i < numbers.length;i++) {
    	if (typeof numbers[i] == "number") {
    		numbers[i] = numbers[i].toPrecision(12)
    		if (i < 2 * player.options.psi.args - 2) {
    			if (i == 0 && player.options.psi.side == "l") {
    				numbers[i] = numbers[i].replace(/\.0+$/, "")
    			} else {
    				numbers[i] = numbers[i].replace(".", "").replace(/e[+-]\d+/, "").replace(/(?!^)0+$/, "")
 				}
    		}
    	}
    }
    log(numbers,"numbers")
    if(player.options.psi.args==0){
    	return letters.map(letter).join("")
    }
    if(player.options.psi.side=="l"){
		var formattedValue=numbers[0]
		if (player.options.psi.letter[0]==1) if (numbers[0]>=1e9) formattedValue=formatValue("Mixed scientific",numbers[0],2,2)
    	return numbers.slice(2).join("").slice(0,player.options.psi.chars).replace(/[-$]$/,"")+letters.map(letter).join("")+formattedValue
    }
    if(numbers.length==1&&numbers[0]=="1"&&!player.options.psi.forceNumbers){
    	return letters.map(letter).join("")
    }
    return letters.map(letter).join("")+numbers.join("").slice(0,player.options.psi.chars).replace(/[-$]$/,"")
}

function convTo(notation, num) {
	var result = ""
	var rest = ""
	if (num >= 1e9) {
		var log = Math.floor(Math.log10(num))
		var step = Math.max(Math.floor(log / 3 - 2), 0)
		num = Math.round(num / Math.pow(10, Math.max(log - 6, 0))) * Math.pow(10, Math.max(log - 6, 0) % 3)
		if (num >= 1e6) {
			num /= 1000
			step++
		}
		rest = " " + FormatList[step]
	}
	if (notation == 'Greek') {
		const marks = [["", "A", "B", "Γ", "Δ", "E", "Ϛ", "Z", "H", "Θ"], ["", "I", "K", "Λ", "M", "N", "Ξ", "O", "Π", "Ϟ"], ["", "P", "Σ", "T", "Y", "Φ", "X", "Ψ", "Ω", "Ϡ"]]
		var needMark = false
		while (num > 0) {
			if (needMark) result = ',' + marks[2][Math.floor(num / 100) % 10] + marks[1][Math.floor(num / 10) % 10] + marks[0][num % 10] + result
			else result = marks[2][Math.floor(num / 100) % 10] + marks[1][Math.floor(num / 10) % 10] + marks[0][num % 10]
			num = Math.floor(num / 1000)
			needMark = true
		}
	} else if (notation == 'Morse code') {
		while (num > 0) {
			var mod = num % 10
			result = (mod > 0 && mod < 6 ? "·" : '-') + (mod > 1 && mod < 7 ? "·" : '-') + (mod > 2 && mod < 8 ? "·" : '-') + (mod > 3 && mod < 9 ? "·" : '-') + (mod > 4 ? "·" : '-') + (result == "" ? "" : " " + result)
			num = Math.floor(num / 10)
		}
	} else if (notation == 'Symbols') {
		const syms = [")", "!", "@", "#", "$", "%", "^", "&", "*", "("]
		while (num > 0) {
			result = syms[num % 10] + result
			num = Math.floor(num / 10)
		}
	} else if (notation == 'Lines') {
		const syms = ["\\", "_", "–", "‾", "-", "—", "=", "／", "⧸", "/"]
		while (num > 0) {
			result = syms[num % 10] + result
			num = Math.floor(num / 10)
		}
	} else if (notation=='Simplified Written') {
		const parts = ["Ze", "On", "Tw", "Th", "Fo", "Fi", "Si", "Se", "Ei", "Ni"]
		while (num > 0) {
			result = parts[num % 10] + result
			num = Math.floor(num / 10)
		}
	} else if (notation=="Blind") return ""
	else if (notation=="Layered Symbols") return ""
	return result + rest
}

//Iroha code
function bin_log (n) {
  if (n.lt(1)) {
    return bin_log(bin_inv(n)).negate();
  }
  let r = Math.floor(n.log(2));
  let x = Decimal_BI.pow(2, r);
  return Decimal_BI.plus(r, n.div(x).sub(1));
}

function bin_inv (n) {
  let x = Decimal_BI.pow(2, Math.ceil(n.log(2)));
  let diff = x.sub(n);
  return Decimal_BI.div(1, x).plus(diff.div(x.pow(2)).times(2));
}

let iroha_zero = '日';

let iroha_one = '山';

let iroha_negate = function (x) {return '見' + x}

let iroha_invert = function (x) {return '世' + x}

let iroha_log = function (x) {return 'ログ' + x}

let iroha_special = 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせアイウエオカキクケコ';

function iroha (n, depth) {
  if (!break_infinity_js) if (n instanceof Decimal) n = n.toString()
  n = new Decimal_BI(n);
  if (isNaN(n.e)) {
    return '今';
  }
  if (depth === 0) {
    return '';
  }
  if (n.eq(0)) {
    return iroha_zero;
  }
  if (n.eq(1)) {
    return iroha_one;
  }
  if (n.lt(0)) {
    return iroha_negate(iroha(n.negate(), depth));
  }
  if (n.lt(1)) {
    return iroha_invert(iroha(bin_inv(n), depth));
  }
  let log = bin_log(bin_log(n));
  if (log < -27 || log > 55) {
	  return iroha_log(iroha(bin_log(n), depth))
  }
  let prefix = (log.lt(0)) ? ((x) => x + 27) : ((x) => x);
  log = log.abs();
  let num = Math.round(log.floor().toNumber());
  let rem = log.sub(num);
  let rec = bin_inv(Decimal_BI.sub(1, rem));
  return iroha_special[prefix(num)] + (rec.eq(1) ? '' : iroha(rec, depth - 1));
}

//Myriads
function getMyriadAbbreviation(x) {
	var log2 = Math.floor(Math.max(Math.log2(x), 0))
	var step = log2
	var x2 = x
	var r = ""

	for (var i = 0; i < 10; i++) {
		var pow2 = Math.pow(2, step)
		if (x2 >= pow2) {
			if (step == 0) r = "My" + (r ? ". " + r : "")
			else r = FormatList[step + 1] + (r ? "." + r : "")
			x2 -= pow2
		}
		if (step == 0) break
		step--
	}

	if (x >= 2) r += "yl"
	return r
}

function getMyriadStandard(v, places = 2) {
	v = E(v)

	var log = Math.floor(v.log10())
	var mant = v.mantissa
	var myr = Math.floor(log / 4)
	var myrLog = Math.floor(Math.max(Math.log2(myr), 0))
	places = Math.min(places, 9 - myrLog)

	var placesDiff = log - myr * 4 - places
	mant = Math.floor(mant * Math.pow(10, places))
	if (placesDiff > 0) mant *= Math.pow(10, placesDiff)
	else mant /= Math.pow(10, -placesDiff)

	return (places >= 0 ? mant + (myr ? " " : "") : "") + (myr ? getMyriadAbbreviation(myr) : "")
}

//Fonster's Prefixes
//https://sites.google.com/site/pointlesslargenumberstuff/home/l/pgln2/2msiprefixes
let FONSTER = {
	PREFIXES: {
		u: ["", "K", "M", "G", "T", "P", "E", "Z", "Y", "B"],
		t: ["", "O", "A", "R", "Y", "J", "S", "C", "N", "X"],
		h: ["", "α", "β", "Γ", "Δ", "Θ", "I", "κ", "Λ", "Σ"]
	},
	NAMES: {
		u: ["", "kila", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta", "bronta"],
		//Bronto = Thunder
		t: ["", "geopa", "amosa", "hapra", "kyra", "pija", "sagana", "pectra", "nisaba", "zozta"],
		h: ["", "alpha", "beta", "gamma", "delta", "theta", "iota", "kappa", "lambda", "sigma"],

		//Fact: All the multipliers to omega- end with "g!"
		mul_u: ["", "kig", "meg", "gig", "teg", "peg", "exg", "zeg", "yog", "brog"],
		mul_t: ["", "geog", "amg", "hag", "kyg", "pig", "sag", "preg", "nig", "zog"],
		mul_h: ["", "alg", "beg", "gag", "deg", "theg", "iog", "kag", "lag", "sig"]
	},

	FORMAT_ROOT(kind, x) {
		let prefix = kind == "mul" ? "mul_" : ""
		let type = FONSTER[kind == "abb" ? "PREFIXES" : "NAMES"]

		let r = type[prefix + "h"][Math.floor(x / 100)] + type[prefix + "t"][Math.floor(x / 10) % 10] + type[prefix + "u"][x % 10]
		if (kind == "mul") r += "'"
		return r
	},
	FORMAT(kind, x) {
		let precision = kind == "abb" ? 3 : 2
		let log = Math.floor(Math.log10(x) / 3)
		let r = ""
		for (var i = 0; i < precision; i++) {
			if (log - i < 0) break
			var value = Math.floor(x / Math.pow(10, (log - i) * 3)) % 1000
			if (value > 1 || (value >= 1 && i > 0) || log == 0) {
				if (r != "") r += "-"
				r += FONSTER.FORMAT_ROOT(kind == "abb" ? "abb" : log - i > 0 ? "mul" : "", value)
			}
			if (log - i > 0) r += kind == "abb" ? "Ω" : log - i > 1 ? "omego" : "omega"
		}
		var remain = log - precision + 1
		if (remain > 1) r += "^" + remain
		return r
	}
}

//Formatting
let FORMAT_INTS_DIFFERENTLY = ["Greek", "Morse code", "Symbols", "Lines", "Simplified Written", "Layered Symbols", "Blind"]
function getFullExpansion(num) {
	if (num === null) return "NaN"
	if (isNaN(num)) return "NaN"
	if (!break_infinity_js && typeof(num) != "number") if (isNaN(num.logarithm)) return "NaN"
	if (num >= 1e9) return shorten(num)
	if (FORMAT_INTS_DIFFERENTLY.includes(player.options.notation)) return convTo(player.options.notation, num)
	return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

shorten = function (money) {
  return formatValue(player.options.notation, money, 2, 2);
};

shortenCosts = function (money) {
  return formatValue(player.options.notation, money, 0, 0);
};

shortenPreInfCosts = function (money) {
    if (money.exponent<0) return Math.round(money.mantissa) + " / " + formatValue(player.options.notation, Decimal.pow(10, -money.exponent), 0, 0)
	return formatValue(player.options.notation, money, (money.mantissa>1&&money.exponent>308)?2:0, 0);
};

shortenInfDimCosts = function (money) {
	return formatValue(player.options.notation, money, ECComps("eterc12")?2:0, 0);
};

shortenDimensions = function (money) {
	return formatValue(player.options.notation, money, 2, 0);
};

shortenMoney = function (money) {
  return formatValue(player.options.notation, money, 2, 1);
};

shortenND = function (money) {
	return formatValue(player.options.notation, money, 2, inNGM(4) ? Math.min(Math.max(3 - money.exponent, 0), 3) : 0)
}


//Non-Number Formatting
function timeDisplay(time) {
  if (player.options.notation === "Blind") return ""

  time = time / 10
  if (time <= 10) return time.toFixed(3) + " seconds"
  time = Math.floor(time)

  if (time >= 31536000) {
      return Math.floor(time / 31536000) + " years, " + Math.floor((time % 31536000) / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 86400) {
      return Math.floor(time / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 3600) {
      return Math.floor(time / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 60) {
      return Math.floor(time / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else return Math.floor(time % 60) + " seconds"
}

function preformat(int) {
	if (player.options.notation === "Blind") return ""
	if (int.toString().length == 1) return "0"+int
	else return int
}

let small = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y', 'r', 'q']
let plTime = 5.391247e-44

function timeDisplayShort(time, rep, places) {
	if (player.options.notation === "Blind") return ""
	if (Decimal.gt(time, Number.MAX_VALUE)) {
		if (Decimal.eq(time, 1 / 0)) return 'eternity'
		return shorten(Decimal.div(time, 31556952e100)) + ' ae'
	}
	if (rep && Decimal.lt(time, 1e-100) && Decimal.gt(time, 0)) {
		return "1 / " + formatValue(player.options.notation, Decimal.div(10, time), places, 2) + " s"
	}
	time = time / 10
	if (rep && time > 0 && time < 1) {
		let log
		let timeNum = time
		if (time + 0 !== time) {
			log = time.log10()
			timeNum = time.toNumber()
		} else log = Math.log10(time)

		if (log < Math.log10(plTime)) return "1 / " + formatValue(player.options.notation, Decimal.div(1, time), places, 2) + " s"
		if (log < -30) return formatValue(player.options.notation, Decimal.div(time, plTime), places, 2) + " t<sub>P</sub>" //1 tP = 1 Planck Time
		if (log < -2) {
			log = Math.ceil(-log)
			return (timeNum * Math.pow(1e3, Math.ceil(log / 3))).toFixed(Math.max(places + (log - 1) % 3 - 2, 0)) + " " + small[Math.ceil(log / 3)] + "s"
		}
		return (timeNum * 100).toFixed(time < 0.1 ? places : places - 1) + " cs"
	}
	if (time < 60) return time.toFixed(time < 10 ? places : places - 1) + " s" + (rep ? "" : "econds")
	if (time < 3600) return Math.floor(time / 60) + ":" + preformat(Math.floor(time % 60))
	if (time < 86400) return Math.floor(time / 3600) + ":" + preformat(Math.floor((time/60) % 60)) + ":" + preformat(Math.floor(time % 60))
	if (time < 31556952 && rep) return Math.floor(time / 86400) + ' d & ' + ((time/3600) % 24).toFixed(1) + " h"
	if (time < 31556952) return Math.floor(time / 86400) + ' d & ' + Math.floor((time/3600) % 24) + ":" + preformat(Math.floor((time / 60) % 60)) + ":" + preformat(Math.floor(time % 60))
	if (time < 315569520) return Math.floor(time / 31556952) + ' y & ' + ((time / 86400) % 365.2425).toFixed(1) + ' d'
	if (time < 31556952 * 13.8e9) return shorten(time / 315569520) + ' y'
	if (time < 31556952e100) return shorten(time / 31556952 * 13.8e9) + ' uni' //1 uni = 13.8B years
	return shorten(time / 31556952e100) + ' ae' //1 ae = 1 aeon = 1 googol years
}

function rateFormat(apm, unit) {
	if (player.options.notation === "Blind") return ""
	let time = "min"
	if (apm.lt(1)) {
		apm = apm.times(60)
		time = "hour"
	} else if (apm.gt(60)) {
		apm = apm.div(60)
		time = "sec"
	}
	if (apm.lt(1)) {
		apm = apm.times(24)
		time = "day"
	}
	return shorten(apm) + (unit ? " " + unit : "") + "/" + time
}

function formatPercentage(x, digits = 1, reduction) {
	if (player.options.notation === "Blind") return ""
	x = Decimal.times(x, 100)
	if (x.lt(100) && reduction) digits += Math.ceil(-x.log10() + 2)
	if (x.gt(1e9)) return shorten(x)

	let n = x.toFixed(digits)
	if (parseFloat(n) < 1e3 && !FORMAT_INTS_DIFFERENTLY.includes(player.options.notation)) return n
	return getFullExpansion(Math.round(x.toNumber()))
}

function formatReductionPercentage(x, digits = 1, maxDigits) {
	if (player.options.notation === "Blind") return ""
	digits += Math.floor(Math.log10(x))
	if (maxDigits) digits = Math.min(digits, maxDigits)
	return (100 - 100 / x).toFixed(digits)
}