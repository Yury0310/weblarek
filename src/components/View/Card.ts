import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _id: string;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
    this._id = "";
  }

  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id;
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent =
        value === null ? "Бесценно" : `${value} синапсов`;
    }
  }
}

export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.className = "card__category";
      // ИСПРАВЛЕНО: Добавлено приведение типов для безопасного поиска в мапе
      const classModifier =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.classList.add(classModifier);
    }
  }
}

export class CardPreview extends CardCatalog {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (actions?.onClick) {
      this._button?.addEventListener("click", actions.onClick);
    }
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null && this._button) {
      this._button.disabled = true;
    }
  }
}

export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._button = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    if (actions?.onClick) {
      this._button?.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }
}
