import { getCountriesStartingWith } from "../src/utils/getCountriesStartingWith";
import axios from "axios";

jest.mock("axios");

describe("getCountriesStartingWith", () => {
  it("should return an array of countries starting with the search word", async () => {
      (axios.get as jest.Mock).mockResolvedValue({
          data: {
              data: {
                  FR: {country: "France"},
                  DE: {country: "Germany"},
                  IT: {country: "Italy"},
              },
          },
      });
    const countries = await getCountriesStartingWith("France");
    expect(countries).toEqual(["France"]);
  });
});