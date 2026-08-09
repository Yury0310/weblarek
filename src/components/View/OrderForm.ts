import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

export class OrderForm extends Form<IBuyer> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector(
      "button[name=card]",
    ) as HTMLButtonElement;
    this._cashButton = container.querySelector(
      "button[name=cash]",
    ) as HTMLButtonElement;

    this._addressInput = container.querySelector(
      "input[name=address]",
    ) as HTMLInputElement;

    this._cardButton?.addEventListener("click", () =>
      this.onPaymentChange("online"),
    );
    this._cashButton?.addEventListener("click", () =>
      this.onPaymentChange("cash"),
    );
  }

  protected onPaymentChange(value: TPayment): void {
    this.events.emit("payment:change", { payment: value });
  }

  set payment(value: TPayment | null) {
    if (value === null) {
      this._cardButton?.classList.remove("button_alt-active");
      this._cashButton?.classList.remove("button_alt-active");
    } else {
      this._cardButton?.classList.toggle(
        "button_alt-active",
        value === "online",
      );
      this._cashButton?.classList.toggle("button_alt-active", value === "cash");
    }
  }

  set address(value: string) {
    if (this._addressInput) {
      this._addressInput.value = value;
    }
  }
}
