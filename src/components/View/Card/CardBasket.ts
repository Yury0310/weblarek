import { Card, ICardActions } from "./Card";

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
