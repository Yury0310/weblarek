import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";

export class ContactsForm extends Form<IBuyer> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._emailInput = container.querySelector(
      "input[name=email]",
    ) as HTMLInputElement;
    this._phoneInput = container.querySelector(
      "input[name=phone]",
    ) as HTMLInputElement;
  }

  set email(value: string) {
    if (this._emailInput) {
      this._emailInput.value = value;
    }
  }

  set phone(value: string) {
    if (this._phoneInput) {
      this._phoneInput.value = value;
    }
  }
}
