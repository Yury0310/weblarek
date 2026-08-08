import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IPageState {
  catalog: HTMLElement[];
}

export class Page extends Component<IPageState> {
  protected _catalog: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._catalog = container.querySelector(".gallery") as HTMLElement;
  }

  set catalog(items: HTMLElement[]) {
    if (this._catalog) {
      this._catalog.replaceChildren(...items);
    }
  }
}
