import { getCountriesStartingWith } from "../src/utils/getCountriesStartingWith";

describe("getCountriesStartingWith", () => {
  it("should return an array of countries starting with the search word", async () => {
    const countries = await getCountriesStartingWith("France");
    expect(countries).toEqual(["France"]);
  });
});