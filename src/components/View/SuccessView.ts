import { Component } from "../base/Component";

interface ISuccessState {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class SuccessView extends Component<ISuccessState> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._description = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this._closeButton = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    if (actions?.onClick) {
      this._closeButton?.addEventListener("click", actions.onClick);
    }
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }
}
