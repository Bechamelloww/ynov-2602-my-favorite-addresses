import { Router } from "express";
import usersRouter from "./controllers/Users";
import addressesRouter from "./controllers/Addresses";
import { isAuthorized } from "./utils/isAuthorized";
import { getCountriesStartingWith } from "./utils/getCountriesStartingWith";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/addresses", addressesRouter);

apiRouter.get("/addresses/countries", isAuthorized, async (req, res) => {
  const searchWord = req.query.searchWord as string | undefined;

  if (!searchWord) {
    return res
      .status(400)
      .json({ message: `searchWord query parameter is required` });
  }

  const countries = await getCountriesStartingWith(searchWord);
  return res.json({ items: countries });
});

export default apiRouter;
