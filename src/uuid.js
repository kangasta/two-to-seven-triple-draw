const hexString = (len) => {
	var str;

	do {
		str = Math.random().toString(16).slice(2, len + 2);
	}
	while (str.length < len && len <= 12);

	return str;
};

const uuid4 = () => {
	const lens = [8, 4, 4, 4, 12];

	var str = lens.map(hexString).join('-').split('');
	str[14] = 4;
	str[19] = (Math.floor(Math.random() * 64) % 4 + 8).toString(16);
	return str.join('');
};

export { uuid4 };
