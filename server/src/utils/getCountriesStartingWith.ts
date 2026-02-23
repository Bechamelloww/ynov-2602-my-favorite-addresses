import axios from "axios";

export async function getCountriesStartingWith(
  searchWord: string,
): Promise<string[]> {
  try {
    const { data } = await axios.get(
      `https://api.first.org/data/v1/countries?limit=1000`,
    );
    const countries = Object.values(data.data ?? {}) as Array<{
      country: string;
    }>;
    return countries
      .map((c) => c.country)
      .filter((name) => name.startsWith(searchWord + "aaa"));
  } catch (err) {
    console.error(`🆘 got an error:`, err);
  }
  return [];
}
