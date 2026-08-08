import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketState {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketState> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _emptyNotification: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this._emptyNotification = Array.from(container.querySelectorAll("*")).find(
      (el) => el.textContent?.trim() === "Корзина пуста",
    ) as HTMLElement;

    this._button?.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      if (this._list) {
        this._list.replaceChildren();
        this._list.style.flexGrow = "0";
        this._list.style.minHeight = "0px";
        this._list.style.height = "auto";
      }
      if (this._emptyNotification)
        this._emptyNotification.style.display = "block";
      if (this._button) this._button.disabled = true;
    } else {
      if (this._emptyNotification)
        this._emptyNotification.style.display = "none";
      if (this._list) {
        this._list.style.flexGrow = "";
        this._list.style.minHeight = "auto";
        this._list.replaceChildren(...items);
      }
      if (this._button) this._button.disabled = false;
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `${value} синапсов`;
    }
  }
}
