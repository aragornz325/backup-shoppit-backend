const { GoogleSpreadsheet } = require('google-spreadsheet');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const {
  validateSheetsProduct,
  validateItem,
} = require('../schemas/prod.schema');
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();

const boom = require('@hapi/boom');
const headers = [
  'name',
  'description',
  'currency',
  'regular_price',
  'state',
  'images_url',
  'category',
  'offer_price',
  'min_sell_amount',
  'sku',
  'variation_type',
  'size',
  'color',
  'quantity',
  'Stock_XL',
  'height',
  'width',
  'longitude',
  'weight',
];

let userSheet = null;

class GoogleSheetsRepository {
  async createProductObject(item) {
    const product = {
      name: item.name,
      offer_price: parseInt(item.offer_price, 10),
      regular_price: parseInt(item.offer_price, 10),
      description: item.description,
      image_url: item.image_url,
      stock_XS: parseInt(item.Stock_XS, 10),
      stock_S: parseInt(item.Stock_S, 10),
      stock_M: parseInt(item.Stock_M, 10),
      stock_L: parseInt(item.Stock_L, 10),
      stock_XL: parseInt(item.Stock_XL, 10),
      sku: item.SKU,
      height: parseFloat(item.height),
      width: parseFloat(item.width),
      longitude: parseFloat(item.longitude),
      weight: parseFloat(item.weight),
    };

    return product;
  }

  async docConstructor(spreadId) {
    const doc = new GoogleSpreadsheet(spreadId);
    await doc.useServiceAccountAuth({
      client_email: config.client_email,
      private_key: config.private_key,
    });
    return doc;
  }

  async initSheet(id) {
    const doc = await this.docConstructor(id);
    userSheet = await doc.addSheet({
      title: 'Shoppit',
      headerValues: headers,
    });
    await userSheet.insertDimension('COLUMNS', {
      startIndex: 26,
      endIndex: 1000,
    });
    await userSheet.loadCells('A1:ALL1');
    const celdaId = userSheet.getCellByA1('ALL1');
    celdaId.value = 'id';
    await userSheet.saveUpdatedCells();

    functions.logger.log('initSheet: OK');

    return 'ok';
  }

  async getProduct(spreadId) {
    const doc = await this.docConstructor(spreadId);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();

    if (rows.length <= 0) {
      throw boom.badData('The sheet is empty');
    }
    functions.logger.info(`starting process of destructuring sheet`);
    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      if (item.id) {
        functions.logger.info(`the row is already indexed in the db`);
        continue;
      }
      const rowRef = parseInt(item._rowNumber, 10);
      let payload = await this.createProductObject(item);
      const { error } = validateSheetsProduct.validate(payload);
      if (error) {
        functions.logger.log(`error in item ${rows[i].name}, ${error}`);
        throw boom.badData(`error in item ${rows[i].name}, ${error}`);
      }
      functions.logger.log(`inserting product of row ${rowRef} in collection`);
      const productID = await productsRepository.createProduct(payload);
      functions.logger.log(` setting id in sheet`);
      item.id = productID;
      await item.save();
    }
  }

  async updateProduct(spreadId) {
    const doc = await this.docConstructor(spreadId);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();

    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      let payload = await this.createProductObject(item);
      const rowRef = parseInt(item._rowNumber, 10);
      const productInDb = await productsRepository.getProductById(item.id);
      if (
        productInDb.name === payload.name &&
        productInDb.offer_price === payload.offer_price &&
        productInDb.regular_price === payload.regular_price &&
        productInDb.description === payload.description &&
        productInDb.image_url === payload.image_url &&
        productInDb.stock_XS === payload.stock_XS &&
        productInDb.stock_S === payload.stock_S &&
        productInDb.stock_M === payload.stock_M &&
        productInDb.stock_L === payload.stock_L &&
        productInDb.stock_XL === payload.stock_XL &&
        productInDb.sku === payload.sku &&
        productInDb.height === payload.height &&
        productInDb.width === payload.width &&
        productInDb.longitude === payload.longitude &&
        productInDb.weight === payload.weight
      ) {
        functions.logger.log(`the row ${rowRef} not need to be updated`);
        continue;
      }

      const { error } = validateSheetsProduct.validate(payload);
      if (error) {
        functions.logger.log(`error in item ${rows[i].name}, ${error}`);
        throw boom.badData(`error in item ${rows[i].name}, ${error}`);
      }
      functions.logger.log(`updating product of row ${rowRef} in collection`);
      await productsRepository.updateProduct(item.id, payload);
    }
  }

  // const insertRows = async (req, res) => {
  //   //Recibe una lista de objectos [{..}, {..}]
  //   const { rowsArray, spreadId } = req.body;
  //   if (!rowsArray || !spreadId)
  //    throw boom.badRequest('missing rowsArray or spreadId');

  //   const doc = new GoogleSpreadsheet(spreadId);
  //   doc.useServiceAccountAuth({
  //     client_email: credentials.client_email,
  //     private_key: credentials.private_key,
  //   });
  //   await doc.loadInfo();
  //   try {
  //     const sheet = doc.sheetsByIndex[1];
  //     console.log(typeof rowsArray);
  //     const addedRow = await sheet.addRows(rowsArray);
  //     return res.status(200).json({ result: addedRow });
  //   } catch (err) {
  //     return res.status(500).json({ error: err.message });
  //   }
  // };

  // async insertId(productID, spreadId, rowRef) {
  //   const doc = await this.docConstructor(spreadId);

  //   await doc.loadInfo();
  //   const sheet = doc.sheetsByIndex[1];
  //   const rows = await sheet.getRows();

  //   if (rows.length > 0) {
  //     console.log('tiene mas de uno');
  //   }
  //   return { msg: ' id in sheet Updated' };
  // }

  // const editProducts = async (req, res) => {
  //   const { id, spreadId, editedProduct } = req.body;
  //   if (!id || !editedProduct || !spreadId)
  //     return res.status(400).json({ error: 'Bad request' });
  //   const doc = new GoogleSpreadsheet(spreadId);
  //   doc.useServiceAccountAuth({
  //     client_email: credentials.client_email,
  //     private_key: credentials.private_key,
  //   });
  //   await doc.loadInfo();
  //   const sheet = doc.sheetsByIndex[1];
  //   const rows = await sheet.getRows();
  //   let fila = [];
  //   let updated = false;
  //   rows.forEach(async (row, i) => {
  //     if (row.id == id) {
  //       editedProduct.name ? (row.nombre = editedProduct.name) : null;
  //       editedProduct.salePrice
  //         ? (row['precio_oferta'] = editedProduct.salePrice)
  //         : null;
  //       editedProduct.regularPrice
  //         ? (row['precio_regular'] = editedProduct.regularPrice)
  //         : null;
  //       editedProduct.height ? (row['Alto (cm)'] = editedProduct.height) : null;
  //       editedProduct.width ? (row['Ancho (cm)'] = editedProduct.width) : null;
  //       editedProduct.longitude
  //         ? (row['Longitud (cm)'] = editedProduct.longitude)
  //         : null;
  //       editedProduct.weight ? (row['Peso (kg)'] = editedProduct.weight) : null;
  //       editedProduct.description
  //         ? (row['descripcion'] = editedProduct.description)
  //         : null;
  //       editedProduct.sku ? (row['SKU'] = editedProduct.sku) : null;
  //       await row.save();
  //       console.log(fila);
  //       return res.send('Updated');
  //     } else if (i === rows.length - 1) {
  //       console.log(true);
  //       return res.status(404).json({ error: 'Could not update it' });
  //     }
  //   });
  //   };
}

module.exports = GoogleSheetsRepository;
