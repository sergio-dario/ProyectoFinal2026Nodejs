import db from '../config/firebase.js';

const productsCollection = () => db.collection('products');

export default class ProductModel {
  static async getAll() {
    const snap = await productsCollection().get();
    return snap.docs.map(docItem => ({ id: docItem.id, ...docItem.data() }));
  }

  static async getById(id) {
    const docSnap = await productsCollection().doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }

  static async create(data) {
    const ref = await productsCollection().add(data);
    const docSnap = await ref.get();
    return { id: ref.id, ...docSnap.data() };
  }

  static async update(id, data) {
    const ref = productsCollection().doc(id);
    await ref.set(data, { merge: true });
    const docSnap = await ref.get();
    return { id: docSnap.id, ...docSnap.data() };
  }

  static async delete(id) {
    await productsCollection().doc(id).delete();
    return true;
  }
}
