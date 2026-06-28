import ProductModel from '../models/product.model.js';

export default class ProductsService {
  static async listAll() {
    return await ProductModel.getAll();
  }

  static async getById(id) {
    const product = await ProductModel.getById(id);
    if (!product) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    return product;
  }

  static async create(data) {
    // Validaciones básicas
    if (!data || !data.name || !data.price) {
      const err = new Error('Datos de producto inválidos');
      err.status = 400;
      throw err;
    }
    return await ProductModel.create(data);
  }

  static async update(id, data) {
    const existing = await ProductModel.getById(id);
    if (!existing) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    return await ProductModel.update(id, data);
  }

  static async remove(id) {
    const existing = await ProductModel.getById(id);
    if (!existing) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    await ProductModel.delete(id);
    return { success: true };
  }
}
