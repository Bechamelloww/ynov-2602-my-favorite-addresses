import { map } from "../src/utils/map";

describe("map function", () => {
    it("calls the changeItem function correct number of times with correct parameters", () => {
        const items = [1, 2, 3];
        const spy = jest.fn((item: number) => item * 4);
        map(items, spy);
        expect(spy).toHaveBeenCalledTimes(items.length);
        expect(spy).toHaveBeenNthCalledWith(1, 1);
        expect(spy).toHaveBeenNthCalledWith(2, 2);
        expect(spy).toHaveBeenNthCalledWith(3, 3);
    });
});