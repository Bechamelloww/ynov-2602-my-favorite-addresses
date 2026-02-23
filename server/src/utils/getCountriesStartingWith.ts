import axios from "axios";

export async function getCountriesStartingWith(
  searchWord: string,
): Promise<string[]> {
  try {
    const { data } = await axios.get(
      `https://api.first.org/data/v1/countries?limit=1000`,
    );
    return data.data.data.map((country: { name: string }) => country.name).filter((name: string) => name.startsWith(searchWord));
  } catch (err) {
    console.error(`🆘 got an error:`, err);
  }
  return [];
}
