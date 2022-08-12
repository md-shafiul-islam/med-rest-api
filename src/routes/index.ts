import { Application, Express, Request, Response } from "express";
import { companyRoute } from "./company.route";
import { categoryRoute } from "./category.route";
import { metaRoute } from "./metadata.route";
import { newsRoute } from "./news.route";
import { postRoute } from "./post.route";
import { medicinesRoute } from "./medicine.route";
import { ratingRoute } from "./rating.route";
import { reviewRoute } from "./review.route";
import { userRoute } from "./user.route";
import { genericRoute } from "./generic.route";
import { initialRoute } from "./initial.route";
import { pharmacyRoute } from "./pharmacy.route";

const userUrl = `/api/users`;
const categoryUrl = `/api/categories`;
const companyUrl = `/api/companies`;
const postUrl = `/api/posts`;
const genericUrl = `/api/generics`;
const medicinesUrl = `/api/medicines`;
const ratingUrl = `/api/ratings`;
const reviewUrl = `/api/reviews`;
const newsUrl = `/api/news`;
const metaUrl = "/api/meta-datas";
const tagUrl = "/api/tags";
const pharmacyUrl = `/api/pharmacies`;

export default (app: Application) => {
  app.use(userUrl, userRoute);
  app.use(companyUrl, companyRoute);
  app.use(categoryUrl, categoryRoute);
  app.use(postUrl, postRoute);
  app.use(medicinesUrl, medicinesRoute);
  app.use(genericUrl, genericRoute);
  app.use(ratingUrl, ratingRoute);
  app.use(reviewUrl, reviewRoute);
  app.use(newsUrl, newsRoute);
  app.use(metaUrl, metaRoute);
  app.use("/api/initial", initialRoute);
  app.use(pharmacyUrl, pharmacyRoute);

  app.get("/", (req: Request, resp: Response) => {
    resp.sendStatus(200);
  });

  app.get("/healthCheck", (req: Request, resp: Response) => {
    resp.sendStatus(200);
  });
};
