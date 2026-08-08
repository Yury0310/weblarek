import { Card, ICardActions } from "./Card";
import { categoryMap } from "../../../utils/constants";

export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.className = "card__category";
      const classModifier =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.classList.add(classModifier);
    }
  }
}
