import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { AppApi } from "./components/Models/AppApi";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct, TPayment, IBuyer } from "././types";

import { Header } from "./components/View/Header";
import { Page } from "./components/View/Page";
import { Modal } from "./components/View/Modal";
import { CardCatalog } from "./components/View/Card/CardCatalog";
import { CardPreview } from "./components/View/Card/CardPreview";
import { CardBasket } from "./components/View/Card/CardBasket";
import { BasketView } from "./components/View/BasketView";
import { SuccessView } from "./components/View/SuccessView";

import { OrderForm, ContactsForm } from "./components/View/OrderForm.ts";

const events = new EventEmitter();

const productsModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const modalContainer = document.querySelector(
  "#modal-container",
) as HTMLElement;

const page = new Page(document.body, events);
const header = new Header(
  document.querySelector(".header") as HTMLElement,
  events,
);
const modal = new Modal(modalContainer, events);
const basketViewElement = basketTemplate.content.cloneNode(true) as HTMLElement;
const basketView = new BasketView(
  basketViewElement.firstElementChild as HTMLElement,
  events,
);
const successFormElement = successTemplate.content.cloneNode(
  true,
) as HTMLElement;
const successView = new SuccessView(
  successFormElement.firstElementChild as HTMLElement,
  {
    onClick: () => modal.close(),
  },
);
const cardPreviewElement = cardPreviewTemplate.content.cloneNode(
  true,
) as HTMLElement;
const cardPreview = new CardPreview(
  cardPreviewElement.firstElementChild as HTMLElement,
  {
    onClick: () => {
      const currentItem = productsModel.getCurrentProduct();
      if (currentItem) events.emit("card:buy", { item: currentItem });
    },
  },
);

const orderFormElement = orderTemplate.content.cloneNode(
  true,
) as HTMLFormElement;
const orderForm = new OrderForm(
  orderFormElement.firstElementChild as HTMLFormElement,
  events,
);

const contactsFormElement = contactsTemplate.content.cloneNode(
  true,
) as HTMLFormElement;
const contactsForm = new ContactsForm(
  contactsFormElement.firstElementChild as HTMLFormElement,
  events,
);

// Изменение каталога товаров

events.on("items:changed", () => {
  const cardsHtmlArray = productsModel.getProducts().map((item) => {
    const cardElement = cardCatalogTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const card = new CardCatalog(cardElement.firstElementChild as HTMLElement, {
      onClick: () => events.emit("card:select", { item }),
    });

    return card.render({
      ...item,
      image: CDN_URL + "/" + item.image,
    });
  });
  page.catalog = cardsHtmlArray;
});

// Изменение выбранного для просмотра товара

events.on("card:preview", () => {
  const item = productsModel.getCurrentProduct();
  if (!item) return;
  cardPreview.buttonText = basketModel.isProductIn(item.id)
    ? "Удалить из корзины"
    : "В корзину";
  cardPreview.disabled = item.price === null;

  modal.render({
    content: cardPreview.render({
      ...item,
      image: CDN_URL + "/" + item.image,
    }),
  });
});

// Функция для сборки и рендеринга актуального состояния корзины

events.on("basket:changed", () => {
  header.counter = basketModel.getTotalCount();
  const basketItems = basketModel.getProducts().map((item, index) => {
    const rowElement = cardBasketTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardBasket = new CardBasket(
      rowElement.firstElementChild as HTMLElement,
      {
        onClick: () => basketModel.removeProduct(item),
      },
    );
    cardBasket.index = index + 1;
    return cardBasket.render(item);
  });
  basketView.items = basketItems;
  basketView.total = basketModel.getTotalPrice();
});

// Нажатие кнопки открытия корзины

events.on("basket:open", () => {
  modal.render({
    content: basketView.render(),
  });
});

let lastOrderErrorText = "";
let lastContactsErrorText = "";

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();
  const currentData = buyerModel.getBuyerData();

  const activeFormElement = modalContainer.querySelector(
    "form",
  ) as HTMLFormElement;
  if (!activeFormElement) return;

  if (activeFormElement.name === "order") {
    if (currentData.payment) orderForm.payment = currentData.payment;

    let errorTextOrder = errors.payment || errors.address || "";

    orderForm.valid = !errors.payment && !errors.address;
    if (errorTextOrder !== lastOrderErrorText) {
      orderForm.errors = errorTextOrder;
      lastOrderErrorText = errorTextOrder;
    }
  } else if (activeFormElement.name === "contacts") {
    let errorTextContacts = errors.email || errors.phone || "";

    contactsForm.valid = !errors.email && !errors.phone;
    if (errorTextContacts !== lastContactsErrorText) {
      contactsForm.errors = errorTextContacts;
      lastContactsErrorText = errorTextContacts;
    }
  }
});

//Выбор карточки для просмотра

events.on("card:select", (data: { item: IProduct }) => {
  productsModel.saveCurrentProduct(data.item);
});

// Нажатие кнопки покупки товара

events.on("card:buy", (data: { item: IProduct }) => {
  if (basketModel.isProductIn(data.item.id)) {
    basketModel.removeProduct(data.item);
  } else {
    basketModel.addProduct(data.item);
  }
  productsModel.saveCurrentProduct(data.item);
});

// Нажатие кнопки удаления товара из корзины

events.on("card:remove", (data: { item: IProduct }) => {
  basketModel.removeProduct(data.item);
  events.emit("basket:open");
});

//Нажатие кнопки оформления заказа (Открытие ПЕРВОЙ формы)

events.on("order:open", () => {
  const errors = buyerModel.validate();
  const currentData = buyerModel.getBuyerData();
  let errorText = errors.payment || errors.address || "";
  orderForm.address = currentData.address;
  if (currentData.payment) {
    orderForm.payment = currentData.payment;
  }
  const renderedForm = orderForm.render({
    valid: !errors.payment && !errors.address,
    errors: errorText ? [errorText] : [],
  });
  modal.render({
    content: renderedForm,
  });
});

// Изменение данных в формах и обработка выбора оплаты

events.on("order:input", (data: { field: keyof IBuyer; value: string }) => {
  if (data.field === "address") {
    buyerModel.saveAddress(data.value);
  }
});

events.on("contacts:input", (data: { field: keyof IBuyer; value: string }) => {
  if (data.field === "email") buyerModel.saveEmail(data.value);
  if (data.field === "phone") buyerModel.savePhone(data.value);
});

// выбор кнопок оплаты

events.on("payment:change", (data: { payment: TPayment }) => {
  buyerModel.savePayment(data.payment);
  const activeFormElement = modalContainer.querySelector(
    "form",
  ) as HTMLFormElement;
  if (activeFormElement && activeFormElement.name === "order") {
    const currentOrderForm = new OrderForm(activeFormElement, events);
    currentOrderForm.payment = data.payment;
  }
});

events.on("order:submit", () => {
  const currentData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  let errorText = errors.email || errors.phone || "";

  contactsForm.email = currentData.email;
  contactsForm.phone = currentData.phone;

  modal.render({
    content: contactsForm.render({
      valid: !errors.email && !errors.phone,
      errors: errorText ? [errorText] : [],
    }),
  });
});

// Нажатие кнопки оплаты/завершения оформления заказа (кнопка "Оплатить")

events.on("contacts:submit", () => {
  const buyerData = buyerModel.getBuyerData();

  const finalOrder = {
    payment: buyerData.payment || "online",
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotalPrice(),
    items: basketModel.getProducts().map((item) => item.id),
  };

  appApi
    .orderProducts(finalOrder)
    .then((result) => {
      basketModel.clean();
      buyerModel.clean();
      modal.render({
        content: successView.render({
          total: result.total,
        }),
      });
    })
    .catch((error) => console.error("Ошибка отправки заказа:", error));
});

// Первоначальный запрос к серверу за данными каталога при старте

appApi
  .getProducts()
  .then((response) => {
    productsModel.saveProducts(response.items);
  })
  .catch((error) => {
    console.error("Ошибка при первоначальной загрузке каталога:", error);
  });
