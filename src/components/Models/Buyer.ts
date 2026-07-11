import { TPayment, BuyerData, TFormErrors } from "../../types/index";

export class Buyer {
  protected payment: TPayment | null;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor() {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // Сохранение способа оплаты
  savePayment(payment: TPayment): void {
    this.payment = payment;
  }

  // Сохранение email
  saveEmail(email: string): void {
    this.email = email.trim();
  }

  // Сохранение телефона
  savePhone(phone: string): void {
    this.phone = phone.trim();
  }

  // Сохранение адреса
  saveAddress(address: string): void {
    this.address = address.trim();
  }

  // Получение всех данных покупателя
  getBuyerData(): BuyerData {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // Очистка всех сохраненных данных
  clean(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // Валидация (проверка на заполненность)
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите емэйл";
    }
    if (!this.phone) {
      errors.phone = "Укажите номер телефона";
    }
    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
