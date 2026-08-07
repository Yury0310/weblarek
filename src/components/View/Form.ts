import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _inputTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this._submit = container.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    this._errors = container.querySelector(".form__errors") as HTMLElement;
    this._inputTimer = undefined;

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (!target || !target.name) return;

      clearTimeout(this._inputTimer);

      this._inputTimer = setTimeout(() => {
        const field = target.name as keyof T;
        const value = target.value;
        this.onInputChange(field, value);
      }, 200);
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const formName = (this.container as HTMLFormElement).name;
      this.events.emit(`${formName}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string): void {
    const formName = (this.container as HTMLFormElement).name;
    this.events.emit(`${formName}:input`, { field, value });
  }

  set valid(value: boolean) {
    if (this._submit) {
      this._submit.disabled = !value;
    }
  }

  set errors(value: string) {
    if (this._errors) {
      this._errors.textContent = value;
    }
  }
}
