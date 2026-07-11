import {
  IApi,
  IProductResponse,
  IProduct,
  IOrder,
  IOrderResult,
} from "../../../types/index";

export class AppApi {
  // Защищенное свойство для хранения экземпляра базового Api
  protected _api: IApi;

  // Конструктор принимает объект, соответствующий интерфейсу IApi
  constructor(api: IApi) {
    this._api = api;
  }

  // Метод для получения списка товаров
  getProducts(): Promise<IProduct[]> {
    return this._api
      .get<IProductResponse>("/api/weblarek/product")
      .then((data: IProductResponse) => data.items); // Извлекаем только массив items
  }

  // Метод для отправки заказа на сервер
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/api/weblarek/order", order);
  }
}
