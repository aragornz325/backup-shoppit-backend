import {Application} from "express";
import {getAll} from "./products.controller";

export const productsRoutes = (app: Application) => {
  app.get("/products", getAll);
};
