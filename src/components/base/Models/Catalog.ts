import { IProduct } from "../../../types/index";

export class Catalog {
  products: IProduct[];
  currentProduct: IProduct | undefined;

  constructor() {
    this.products = [];
    this.currentProduct = undefined;
  }

  // Сохранение массива товаров
  saveProducts(data: IProduct[]): void {
    this.products = data;
  }

  // Сохранение товара для подробного отображения
  saveCurrentProduct(data: IProduct | undefined): void {
    this.currentProduct = data;
  }

  // Получение массива всех товаров
  getProducts(): IProduct[] {
    return this.products;
  }

  // Получение текущего выбранного товара
  getCurrentProduct(): IProduct | undefined {
    return this.currentProduct;
  }

  // Получение одного товара по его id
  getProductId(id: string): IProduct | null {
    const foundProduct = this.products.find((product) => product.id === id);
    return foundProduct || null;
  }
}
