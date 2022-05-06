import {Application} from "express";
import {getAll, getProduct} from "./products.controller";

export const productsRoutes = (app: Application) => {
  app.get("/products", getAll);
  app.get("/products/:id", getProduct);
};
