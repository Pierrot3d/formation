export class PageList {
  public name: string;
  public id: HTMLElement;


  constructor(option: PageList) {
    (this.name = option.name),
      (this.id = option.id);
  }
}
