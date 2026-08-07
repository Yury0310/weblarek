import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { AppApi } from "./components/Models/AppApi";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct, TPayment, IBuyer, IProductResponse } from "././types";

import { Page } from "./components/View/Page";
import { Modal } from "./components/View/Modal";
import { CardCatalog, CardPreview, CardBasket } from "./components/View/Card";
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
const modal = new Modal(modalContainer, events);

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

events.on("card:preview", (data: { item: IProduct }) => {
  const item = data.item;
  const cardPreviewElement = cardPreviewTemplate.content.cloneNode(
    true,
  ) as HTMLElement;

  const cardPreview = new CardPreview(
    cardPreviewElement.firstElementChild as HTMLElement,
    {
      onClick: () => events.emit("card:buy", { item }),
    },
  );

  cardPreview.buttonText = basketModel.isProductIn(item.id)
    ? "Удалить из корзины"
    : "В корзину";

  modal.render({
    content: cardPreview.render({
      ...item,
      image: CDN_URL + "/" + item.image,
    }),
  });
});

// Изменение содержимого корзины (Добавление / Удаление)

events.on("basket:changed", () => {
  page.counter = basketModel.getTotalCount();

  const isModalActive = modalContainer?.classList.contains("modal_active");
  if (isModalActive) {
    events.emit("basket:open");
  }
});

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();

  const activeFormElement = modalContainer.querySelector(
    "form",
  ) as HTMLFormElement;
  if (!activeFormElement) return;

  if (activeFormElement.name === "order") {
    const currentData = buyerModel.getBuyerData();
    const currentOrderForm = new OrderForm(activeFormElement, events);

    let errorTextOrder = "";
    if (errors.payment) {
      errorTextOrder = errors.payment;
    } else if (errors.address) {
      errorTextOrder = "Необходимо указать адрес";
    }

    if (currentData.payment) {
      currentOrderForm.payment = currentData.payment;
    }

    currentOrderForm.valid = !errors.payment && !errors.address;
    currentOrderForm.errors = errorTextOrder;
  } else if (activeFormElement.name === "contacts") {
    const currentContactsForm = new ContactsForm(activeFormElement, events);

    let errorTextContacts = "";
    if (errors.email) {
      errorTextContacts = errors.email;
    } else if (errors.phone) {
      errorTextContacts = errors.phone;
    }

    currentContactsForm.valid = !errors.email && !errors.phone;
    currentContactsForm.errors = errorTextContacts;
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

//5.3 Нажатие кнопки удаления товара из корзины
events.on("card:remove", (data: { item: IProduct }) => {
  basketModel.removeProduct(data.item);
  events.emit("basket:open");
});

// Нажатие кнопки открытия корзины (Полный перерендер с нуля при каждом клике)

events.on("basket:open", () => {
  const basketView = basketTemplate.content.cloneNode(true) as HTMLElement;

  const basketListContainer = basketView.querySelector(
    ".basket__list",
  ) as HTMLElement;
  const basketTotalPrice = basketView.querySelector(
    ".basket__price",
  ) as HTMLElement;
  const basketSubmitButton = basketView.querySelector(
    ".basket__button",
  ) as HTMLButtonElement;
  const emptyNotification = Array.from(basketView.querySelectorAll("*")).find(
    (el) => el.textContent?.trim() === "Корзина пуста",
  ) as HTMLElement;

  const basketRoot =
    (basketView.querySelector(".basket") as HTMLElement) ||
    (basketView.firstElementChild as HTMLElement);

  // Вешаем клик по кнопке "Оформить"
  basketSubmitButton?.addEventListener("click", () =>
    events.emit("order:open"),
  );

  const basketItems = basketModel.getProducts();

  if (basketItems.length === 0) {
    if (basketListContainer) {
      basketListContainer.replaceChildren();
      basketListContainer.style.flexGrow = "0";
      basketListContainer.style.minHeight = "0px";
      basketListContainer.style.height = "auto";
    }
    if (basketRoot) {
      basketRoot.style.height = "20vh";
      basketRoot.style.gap = "3rem";
    }

    if (emptyNotification) {
      emptyNotification.style.display = "block";
    }
    if (basketSubmitButton) {
      basketSubmitButton.disabled = true;
    }
    if (basketTotalPrice) {
      basketTotalPrice.textContent = "0 синапсов";
    }
  } else {
    if (emptyNotification) {
      emptyNotification.style.display = "none";
    }

    const rowsHtml = basketItems.map((item, index) => {
      const rowElement = cardBasketTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      const cardBasket = new CardBasket(
        rowElement.firstElementChild as HTMLElement,
        {
          onClick: () => events.emit("card:remove", { item }),
        },
      );
      cardBasket.index = index + 1;
      return cardBasket.render(item);
    });

    if (basketListContainer) {
      // Возвращаем стандартные стили для заполненной корзины
      basketListContainer.style.flexGrow = "";
      basketListContainer.style.minHeight = "auto";
      basketListContainer.replaceChildren(...rowsHtml);
    }

    if (basketSubmitButton) {
      basketSubmitButton.disabled = false;
    }
    if (basketTotalPrice) {
      basketTotalPrice.textContent = `${basketModel.getTotalPrice()} синапсов`;
    }
  }

  modal.render({ content: basketView });
});

//Нажатие кнопки оформления заказа (Открытие ПЕРВОЙ формы)

events.on("order:open", () => {
  const orderFormElement = orderTemplate.content.cloneNode(
    true,
  ) as HTMLFormElement;
  const formHtml = orderFormElement.firstElementChild as HTMLFormElement;
  const dynamicOrderForm = new OrderForm(formHtml, events);

  // Оживляем кнопку "Далее"
  const submitButton = formHtml.querySelector(
    "button[type=submit]",
  ) as HTMLButtonElement;
  submitButton?.addEventListener("click", (e) => {
    e.preventDefault();
    events.emit("order:submit");
  });

  const currentData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  let errorText = "";
  if (errors.payment) {
    errorText = errors.payment;
  } else if (errors.address) {
    errorText = "Необходимо указать адрес";
  }

  if (currentData.address) {
    dynamicOrderForm.address = currentData.address;
  }
  if (currentData.payment) {
    dynamicOrderForm.payment = currentData.payment;
  }

  const renderedForm = dynamicOrderForm.render({
    valid: !errors.payment && !errors.address,
    errors: errorText ? [errorText] : [],
  });

  modal.render({
    content: renderedForm,
  });
});

// 5.6 Изменение данных в формах и обработка выбора оплаты

events.on("order:input", (data: { field: keyof IBuyer; value: string }) => {
  if (data.field === "address") {
    buyerModel.saveAddress(data.value);
  }
});

events.on("contacts:input", (data: { field: keyof IBuyer; value: string }) => {
  if (data.field === "email") buyerModel.saveEmail(data.value);
  if (data.field === "phone") buyerModel.savePhone(data.value);
});

// Слушаем выбор кнопок оплаты
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
  const contactsFormElement = contactsTemplate.content.cloneNode(
    true,
  ) as HTMLFormElement;
  const formHtml = contactsFormElement.firstElementChild as HTMLFormElement;
  const dynamicContactsForm = new ContactsForm(formHtml, events);

  const submitButton = formHtml.querySelector(
    "button[type=submit]",
  ) as HTMLButtonElement;

  submitButton?.addEventListener("click", (e) => {
    e.preventDefault();
    events.emit("contacts:submit");
  });

  const errors = buyerModel.validate();
  let errorText = errors.email || errors.phone || "";

  const renderedContactsForm = dynamicContactsForm.render({
    valid: !errors.email && !errors.phone,
    errors: errorText ? [errorText] : [],
  });

  // Отправляем готовую форму контактов в модалку
  modal.render({
    content: renderedContactsForm,
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
      const successView = successTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      const description = successView.querySelector(
        ".order-success__description",
      ) as HTMLElement;
      const closeButton = successView.querySelector(
        ".order-success__close",
      ) as HTMLButtonElement;

      if (description)
        description.textContent = `Списано ${result.total} синапсов`;
      closeButton?.addEventListener("click", () => modal.close());

      basketModel.clean();
      buyerModel.clean();

      modal.render({ content: successView });
    })
    .catch((error) => console.error("Ошибка отправки заказа:", error));
});

appApi
  .getProducts()
  .then((response: IProductResponse) => {
    productsModel.saveProducts(response.items);
  })
  .catch((error) => {
    console.error("Ошибка при первоначальной загрузке каталога:", error);
  });
