import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket {
  protected _products: IProduct[];
  protected _events: IEvents; // Брокер событий

  constructor(events: IEvents) {
    this._products = [];
    this._events = events;
  }

  addProduct(product: IProduct): void {
    this._products.push(product);
    // Изменились данные корзины
    this._events.emit("basket:changed", { items: this._products });
  }

  removeProduct(product: IProduct): void {
    this._products = this._products.filter((item) => item.id !== product.id);
    // Изменились данные корзины
    this._events.emit("basket:changed", { items: this._products });
  }

  clean(): void {
    this._products = [];
    // Корзина очищена
    this._events.emit("basket:changed", { items: this._products });
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getTotalPrice(): number {
    return this._products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );
  }

  getTotalCount(): number {
    return this._products.length;
  }

  isProductIn(id: string): boolean {
    return this._products.some((product) => product.id === id);
  }
}
