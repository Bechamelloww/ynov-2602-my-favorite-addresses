import { filter } from "../src/utils/filter";

describe("filter", () => {
  it("calls the predicate for each element with the correct arguments", () => {
    const items = [1, 2, 3];
    const predicate = jest.fn((item: number) => item > 1);
    filter(items, predicate);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 1);
    expect(predicate).toHaveBeenNthCalledWith(2, 2);
    expect(predicate).toHaveBeenNthCalledWith(3, 3);
  });
});
