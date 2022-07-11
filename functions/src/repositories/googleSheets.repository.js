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
  'offer_price',
  'regular_price',
  'description',
  'image_url',
  'height',
  'width',
  'weight',
  'longitude',
  'SKU',
  'Stock_XS',
  'Stock_S',
  'Stock_M',
  'Stock_L',
  'Stock_XL',
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
      height: parseInt(item.height, 10),
      width: parseInt(item.width, 10),
      longitude: parseInt(item.longitude, 10),
      weight: parseInt(item.weight, 10),
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

  async initSheet(spreadId) {
    const doc = await this.docConstructor(spreadId);
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
    console.log('esto ese row', rows.length);
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
      let payload = this.createProductObject(item);
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
    if (rows.length <= 0) {
      throw boom.badData('The sheet is empty');
    }
    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      const rowRef = parseInt(item._rowNumber, 10);
      functions.logger.info(`starting process of updating product`);
      const productInDb = await productsRepository.getProductById(item.id);
      if (
        productInDb.name === item.name &&
        productInDb.offer_price === item.offer_price &&
        productInDb.regular_price === item.regular_price &&
        productInDb.description === item.description &&
        productInDb.image_url === item.image_url &&
        productInDb.stock_XS === item.stock_XS &&
        productInDb.stock_S === item.stock_S &&
        productInDb.stock_M === item.stock_M &&
        productInDb.stock_L === item.stock_L &&
        productInDb.stock_XL === item.stock_XL &&
        productInDb.sku === item.sku &&
        productInDb.height === item.height &&
        productInDb.width === item.width &&
        productInDb.longitude === item.longitude &&
        productInDb.weight === item.weight
      ) {
        functions.logger.info(
          `the product in row ${rowRef} does not need to be updated`
        );
        continue;
      }
      let payload = this.createProductObject(item);
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

  // async getProducts(spreadId) {
  //   const doc = this.docConstructor(spreadId);

  //   await doc.loadInfo();
  //   try {
  //     const sheet = doc.sheetsByIndex[1];
  //     const rows = await sheet.getRows();
  //     // return res.send(rows[1]['precio_oferta'])
  //     let prodList = [];
  //     let index = 0;
  //     for (let i = 0; i < rows.length; i++) {

  //       if (rows.nombre && rows.id) {
  //         let itemL = {
  //           ['nombre']: rows[i]['nombre'],
  //           ['id']: rows[i]['id'],
  //           ['precio_oferta']: rows[i]['precio_oferta'],
  //           ['precio_regular']: rows[i]['precio_regular'],
  //           ['Stock XS']: rows[i]['Stock XS'],
  //           ['Stock S']: rows[i]['Stock S'],
  //           ['Stock M (por default)']: rows[i]['Stock M (por default)'],
  //           ['Stock L']: rows[i]['Stock L'],
  //           ['Stock XL']: rows[i]['Stock XL'],
  //           ['descripcion']: rows[i]['descripcion'],
  //           ['SKU']: rows[i]['SKU'],
  //           ['Alto (cm)']: rows[i]['Alto (cm)'],
  //           ['Ancho (cm)']: rows[i]['Ancho (cm)'],
  //           ['Longitud (cm)']: rows[i]['Longitud (cm)'],
  //           ['Peso (kg)']: rows[i]['Peso (kg)'],
  //           ['numFila']: i,
  //         };
  //         prodList.push(itemL);
  //         index++;
  //       } else {
  //         throw boom.badData('Empty params');
  //       }
  //     }
  //     return prodList;
  //   } catch (error) {
  //     throw boom.badData(error);
  //   }
  // }

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
