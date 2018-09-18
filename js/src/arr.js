const arraySubtraction = (a, b) => {
	return a.filter(c => !b.includes(c));
};

const last = (arr) => arr[arr.length-1];

const uniqueFilter = (element, index, array) => {
	return array.indexOf(element) === index;
};

export {arraySubtraction, last, uniqueFilter};