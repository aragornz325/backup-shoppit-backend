const { GoogleSpreadsheet } = require('google-spreadsheet');
const boom = require('@hapi/boom');
const { config } = require('../config/config');
const functions = require('firebase-functions');

const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();

const {
  createProduct,
  createInSheetNewShoppitProduct,
} = require('../schemas/prod.schema');

const headers = [
  'Proveedor',
  'Codigo',
  'SKU',
  'SAP',
  'Descripcion',
  'Rubro',
  'Linea',
  'Sublinea',
  'Marca',
  'Forma',
  'UxB',
  'Imp. Int.',
  'IVA',
  'Cotiz.',
  'LISTA GENERAL',
  'LISTA MELI',
];

let userSheet = null;

class GoogleSheetsRepository {
  async createProductObject(spreadId, item, rowRef, userId) {
    const listageneralSplit = item['LISTA GENERAL']
      ? item['LISTA GENERAL'].split(' ')
      : '0,0';
    const listameliSplit = item['LISTA MELI']
      ? item['LISTA MELI'].split(' ')
      : '0,0';
    const impIntSplit = item['Imp. Int.']
      ? item['Imp. Int.'].split(' ')
      : '0,0';
    const ivaSplit = item['IVA'] ? item['IVA'].split(' ') : '0,0';

    const listaGeneral = parseFloat(listageneralSplit[1].replace(',', '.'), 10);
    const listaMeli = parseFloat(listameliSplit[1].replace(',', '.'), 10);
    const impInt = parseFloat(impIntSplit[0], 10);
    const iva = parseFloat(ivaSplit[0], 10);

    const product = {
      proveedor: item.Proveedor,
      codigo: item['Código'],
      sku: item.SKU,
      sap: item.SAP,
      descripcion: item.Descripcion,
      rubro: item.Rubro || 'sin Rubro',
      linea: item.Linea || 'sin Linea',
      sublinea: item.Sublinea || 'sin sublinea',
      marca: item.Marca || 'sin marca',
      forma: item.Forma,
      uxb: parseInt(item.UxB, 10),
      impInt,
      iva,
      cotiz: item.Cotiz || 1,
      listaGeneral: isNaN(listaGeneral) ? 0 : listaGeneral,
      listaMeli: isNaN(listaMeli) ? 0 : listaMeli,
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

  async getProduct(spreadId, userId) {
    const doc = await this.docConstructor(spreadId);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();

    if (rows.length <= 0) {
      throw boom.badData('The sheet is empty');
    }
    functions.logger.info(`starting process of destructuring sheet`);
    const productsForBatch = [];
    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      if (item.id) {
        functions.logger.info(`the row is already indexed in the db`);
        continue;
      }
      const rowRef = parseInt(item._rowNumber, 10);
      let payload = await this.createProductObject(
        spreadId,
        item,
        rowRef,
        userId
      );

      const { error } = createInSheetNewShoppitProduct.validate(payload);
      if (error) {
        functions.logger.log(`error in item ${rows[i].name}, ${error}`);
        throw boom.badData(`error in item ${rows[i].name}, ${error}`);
      }
      functions.logger.log(`inserting product of row ${rowRef} in collection`);
      productsForBatch.push(payload);
      item.id = 'created';
      await item.save();
    }
    return productsForBatch;
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
        productInDb.proveedor === payload.proveedor &&
        productInDb.codigo === payload.codigo &&
        productInDb.sku === payload.sku &&
        productInDb.sap === payload.sap &&
        productInDb.descripcion === payload.descripcion &&
        productInDb.rubro === payload.rubro &&
        productInDb.linea === payload.linea &&
        productInDb.sublinea === payload.sublinea &&
        productInDb.marca === payload.marca &&
        productInDb.UxB === payload.UxB &&
        productInDb.impInt === payload.impInt &&
        productInDb.iva === payload.iva &&
        productInDb.cotiz === payload.cotiz &&
        productInDb.listaGeneral === payload.listaGeneral &&
        productInDb.listaMeli === payload.listaMeli
      ) {
        functions.logger.log(`the row ${rowRef} not need to be updated`);
        continue;
      }

      const { error } = createInSheetNewShoppitProduct.validate(payload);
      if (error) {
        functions.logger.log(`error in item ${rows[i].name}, ${error}`);
        throw boom.badData(`error in item ${rows[i].name}, ${error}`);
      }
      functions.logger.log(`updating product of row ${rowRef} in collection`);
      await productsRepository.updateProduct(item.id, payload);
    }
  }

  async getForWC(spreadId) {
    const doc = await this.docConstructor(spreadId);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();
    let allProducts = [];
    for (const item of rows) {
      allProducts.push({
        name: item.Descripcion,
        type: item.type || 'simple',
        regular_price: item.listaGeneral,
        description: item.Descripcion,
        sku: item.SKU,
        price: item.listaGeneral,
        stock_quantity: item.UxB,
        manage_stock: true,
        stock_status: 'instock',
        categories: [item.Rubro, item.Linea, item.Sublinea],
        images: [
          {
            src: `https://firebasestorage.googleapis.com/v0/b/shoppit-9b9f7.appspot.com/o/productos%2F${item.SKU}.jpg?alt=media`,
          },
        ],
      });
    }
    return allProducts;
  }
}

module.exports = GoogleSheetsRepository;
