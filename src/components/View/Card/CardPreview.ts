import { CardCatalog } from "./CardCatalog";
import { ICardActions } from "./Card";

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
  }

  set disabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}
