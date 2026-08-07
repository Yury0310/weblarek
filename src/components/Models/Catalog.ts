import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Catalog {
  protected _products: IProduct[];
  protected _currentProduct: IProduct | undefined;
  protected _events: IEvents; // Брокер событий

  constructor(events: IEvents) {
    this._products = [];
    this._currentProduct = undefined;
    this._events = events;
  }

  saveProducts(data: IProduct[]): void {
    this._products = data;
    // Генерируем событие: каталог изменился
    this._events.emit("items:changed", { items: this._products });
  }

  // Изменение выбранного товара для просмотра в модалке
  saveCurrentProduct(data: IProduct | undefined): void {
    this._currentProduct = data;
    // Генерируем событие: выбран другой товар
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
