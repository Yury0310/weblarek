// import './scss/styles.scss';
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { IProductResponse, TFormErrors } from "./types/index";

import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/Models/AppApi";
import { API_URL } from "./utils/constants";

const productsModel = new Catalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

// const API_URL = import.meta.env.VITE_API_ORIGIN;

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

productsModel.saveProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProducts());
console.log(
  "Количество товаров после сохранения:",
  productsModel.getProducts().length,
);

productsModel.saveCurrentProduct(apiProducts.items[0]);
console.log(
  "Текущий выбранный товар (геттер):",
  productsModel.getCurrentProduct()?.title,
);

const foundById = productsModel.getProductId(
  "b06cde61-912f-4663-9751-09956c0eed67",
);
console.log(
  'Результат поиска по ID "b06cde61-912f-4663-9751-09956c0eed67":',
  foundById?.title,
);

console.log("\n> Проверка методов Basket:");
if (foundById) basketModel.addProduct(foundById);
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

console.log("Количество товаров в корзине:", basketModel.getTotalCount());
console.log("Список товаров в корзине:", basketModel.getProducts());
console.log(
  "Проверка наличия товара в корзине (true/false):",
  basketModel.isProductIn("b06cde61-912f-4663-9751-09956c0eed67"),
);
console.log("Общая расчетная стоимость корзины:", basketModel.getTotalPrice());

basketModel.removeProduct(apiProducts.items[0]);
console.log("Количество товаров после удаления:", basketModel.getTotalCount());
console.log("Новая сумма корзины:", basketModel.getTotalPrice());

basketModel.clean();
console.log(
  "Количество товаров после полной очистки корзины:",
  basketModel.getTotalCount(),
);

console.log("\n> Проверка методов Buyer:");
console.log("Изначальное состояние анкеты:", buyerModel.getBuyerData());
console.log("Ошибки валидации пустой анкеты:", buyerModel.validate());

buyerModel.savePayment("online");
buyerModel.saveEmail("junior@dev.ru");
buyerModel.saveAddress("Офис");
buyerModel.savePhone("+79998887766");

const initialErrors: TFormErrors = buyerModel.validate();
console.log("Ошибки пустой анкеты:", initialErrors);
console.log(
  "Полученные данные покупателя из модели (геттер):",
  buyerModel.getBuyerData(),
);

buyerModel.clean();
console.log(
  "Состояние анкеты после сброса (clean):",
  buyerModel.getBuyerData(),
);

appApi
  .getProducts()
  .then((response: IProductResponse) => {
    console.log(
      `Сервер успешно вернул массив данных. Количество элементов: ${response.total}`,
    );

    productsModel.saveProducts(response.items);
    const finalStoredCatalog = productsModel.getProducts();

    console.log(
      "Каталог успешно перезаписан. Текущий размер хранилища модели:",
      finalStoredCatalog.length,
    );
    console.log(
      "Полный массив товаров, хранящийся в модели данных:",
      finalStoredCatalog,
    );
  })
  .catch((error) => {
    console.error(
      "Критическая ошибка при работе со слоем коммуникации:",
      error,
    );
  });
