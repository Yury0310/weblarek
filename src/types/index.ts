export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
// тип оплаты
export type TPayment = "online" | "cash";

//интерфейс покупателя
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Тип данных, возвращаемый методом getBuyerData
export type BuyerData = IBuyer;

// ответ сервера со списком товаров
export interface IProductResponse {
  items: IProduct[]; //массив товаров
  total: number; //кол-во товаров
}

// данные заказа для отправки на сервер
export interface IOrder extends IBuyer {
  items: string[]; //id выбранных товаров
  total: number; //сумма заказа
}

// ответ  сервера при успешном заказе
export interface IOrderResult {
  id: string; //id заказа, присвоенный сервером
  total: number; //итоговая сумма заказа
}
