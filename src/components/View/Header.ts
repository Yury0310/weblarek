import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderState {
  counter: number;
}

export class Header extends Component<IHeaderState> {
  protected _counter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._counter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;

    this._basketButton?.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    if (this._counter) {
      this._counter.textContent = String(value);
    }
  }
}
