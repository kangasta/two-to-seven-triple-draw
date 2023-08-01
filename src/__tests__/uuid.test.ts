import { uuid4 } from '../uuid';

describe('uuid4', (): void => {
  it('looks like a uuid v4', (): void => {
    const char19 = ['8', '9', 'a', 'b'];

    let curr;
    const prevs = [];

    for (let i = 0; i < 32; i++) {
      curr = uuid4();
      expect(curr.split('-').map((a: string): number => a.length)).toEqual([
        8, 4, 4, 4, 12,
      ]);
      expect(curr.split('')[14]).toEqual('4');
      expect(char19.includes(curr.split('')[19])).toEqual(true);
      expect(prevs.includes(curr)).toEqual(false);
      prevs.push(curr);
    }
  });
  it('checks that random hex strings are long enough', (): void => {
    const random = jest.fn((): number => 0.1234123412341234);
    for (let i = 0; i < 10; i++) {
      random.mockImplementationOnce((): number => 0.1234);
    }
    Math.random = random;
    expect(
      uuid4()
        .split('-')
        .map((a: string): number => a.length),
    ).toEqual([8, 4, 4, 4, 12]);
  });
});
