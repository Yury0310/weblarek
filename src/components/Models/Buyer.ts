import { TPayment, IBuyer, TFormErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  protected _payment: TPayment | null;
  protected _email: string;
  protected _phone: string;
  protected _address: string;
  protected _events: IEvents;
  constructor(events: IEvents) {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";
    this._events = events;
  }

  savePayment(payment: TPayment): void {
    this._payment = payment;
    this._events.emit("buyer:changed", this.getBuyerData());
  }

  saveEmail(email: string): void {
    this._email = email.trim();
    this._events.emit("buyer:changed", this.getBuyerData());
  }

  savePhone(phone: string): void {
    this._phone = phone.trim();
    this._events.emit("buyer:changed", this.getBuyerData());
  }

  saveAddress(address: string): void {
    this._address = address.trim();
    this._events.emit("buyer:changed", this.getBuyerData());
  }

  getBuyerData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clean(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";
    this._events.emit("buyer:changed", this.getBuyerData());
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._email) {
      errors.email = "Укажите емэйл";
    }
    if (!this._phone) {
      errors.phone = "Укажите номер телефона";
    }
    if (!this._address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
