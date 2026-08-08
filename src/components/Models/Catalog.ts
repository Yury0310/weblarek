import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Catalog {
  protected _products: IProduct[];
  protected _currentProduct: IProduct | undefined;
  protected _events: IEvents;

  constructor(events: IEvents) {
    this._products = [];
    this._currentProduct = undefined;
    this._events = events;
  }

  saveProducts(data: IProduct[]): void {
    this._products = data;
    this._events.emit("items:changed", { items: this._products });
  }

  saveCurrentProduct(data: IProduct | undefined): void {
    this._currentProduct = data;
    this._events.emit("card:preview", { item: this._currentProduct });
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getCurrentProduct(): IProduct | undefined {
    return this._currentProduct;
  }

  getProductId(id: string): IProduct | null {
    const foundProduct = this._products.find((product) => product.id === id);
    return foundProduct || null;
  }
}
