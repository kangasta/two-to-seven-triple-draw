/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, Hand, Deck } from '../two-to-seven-triple-draw';

interface ComponentUnderTest {
    name: string;
    class: any;
    parameters: any[][];
}

[
    {name: 'Card', class: Card, parameters: [[0]]},
    {name: 'Hand', class: Hand, parameters: [[0, [0, 2, 4, 6 + 13, 8].map((i: number): Card => new Card(i))]]},
    {name: 'Deck', class: Deck, parameters: [[true, 1]]},
].forEach((CUT: ComponentUnderTest): void => {
    describe(CUT.name, (): void => {
        it('allows stringifying and has fromJSON function to parse from JSON', (): void => {
            CUT.parameters.forEach((parametersArray: any[]): void => {
                const obj: any = new CUT.class(...parametersArray);
                const str = JSON.stringify(obj);
                const parsed = CUT.class.fromJSON(JSON.parse(str));

                expect(parsed).toEqual(obj);
            });
        });
    });
});
