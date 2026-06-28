import ProductsService from '../services/products.service.js';

export async function listAll(req, res, next) {
  try {
    const items = await ProductsService.listAll();
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await ProductsService.getById(req.params.id);
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createProduct(req, res, next) {
  try {
    const created = await ProductsService.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const updated = await ProductsService.update(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await ProductsService.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
