import { IProduct } from "../../../types/index";

export class Basket {
  products: IProduct[];

  constructor() {
    this.products = [];
  }

  // Добавление товара в корзину
  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  // Удаление товара из корзины
  removeProduct(product: IProduct): void {
    this.products = this.products.filter((item) => item.id !== product.id);
  }

  // Очистка всей корзины
  clean(): void {
    this.products = [];
  }

  // Получение массива товаров в корзине
  getProducts(): IProduct[] {
    return this.products;
  }

  // Получение стоимости всех товаров
  getTotalPrice(): number {
    return this.products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );
  }

  // Получение количества товаров
  getTotalCount(): number {
    return this.products.length;
  }

  // Проверка наличия товара в корзине по id
  isProductIn(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }
}
