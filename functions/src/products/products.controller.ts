import {Request, Response} from "express";
import {db} from "../config/firebase";

export async function getAll(req: Request, res: Response) {
  try {
    const productsArray: Array<FirebaseFirestore.DocumentData> = [];
    const products = await db.collection("products").get();
    products.docs.map((prod) => {
      productsArray.push(prod.data());
    });
    res.send(productsArray);
  } catch (error) {
    handleError(res, error);
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(500).send("Bad request");
    const product = await db.collection("products").doc(id).get();
    if (product.exists) {
      return res.send(product.data());
    } else {
      return res.status(404).send("Not found");
    }
  } catch (error) {
    return handleError(res, error);
  }
};

function handleError(res: Response, err: any) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}
