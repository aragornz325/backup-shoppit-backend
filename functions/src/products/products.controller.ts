import {Request, Response} from "express";
import {db} from "../config/firebase";

export async function getAll(req: Request, res: Response) {
  try {
    const productsArray:Array<FirebaseFirestore.DocumentData> = [];
    const products = await db.collection("products").get();
    products.docs.map((prod) => {
      productsArray.push(prod.data());
    });
    res.send(productsArray);
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, err: any) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}
