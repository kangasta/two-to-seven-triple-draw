import { uuid4 } from '../uuid';

describe('uuid4', () => {
	it('looks like a uuid v4', () => {
		const char19 = ['8', '9', 'a', 'b'];

		var curr;
		var prevs = [];

		for (var i = 0; i < 32; i++) {
			curr = uuid4();
			expect(curr.split('-').map(a => a.length)).toEqual([8, 4, 4, 4, 12]);
			expect(curr.split('')[14]).toEqual('4');
			expect(char19.includes(curr.split('')[19])).toEqual(true);
			expect(prevs.includes(curr)).toEqual(false);
			prevs.push(curr);
		}
	});
	it('checks that random hex strings are long enough', () => {
		Math.random = jest.fn(() => 0.1234123412341234);
		for (var i = 0; i < 10; i ++) {
			Math.random.mockImplementationOnce(() => (0.1234));
		}
		expect(uuid4().split('-').map(a => a.length)).toEqual([8, 4, 4, 4, 12]);
	});
});
