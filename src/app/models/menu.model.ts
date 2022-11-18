export class MenuList {
  public name: string;
  public id: HTMLElement;
  public text: string;
  public paragraphe: Paragraphe[];
  public image: string;
  public image_text: string;
  public title: string;
  public full_page: boolean;
  public is_carroussel: boolean;
  public isFullHeight: boolean;
  public link: string;
  public text_height: string;
  public avertissement: string;

  constructor(option: MenuList) {
    (this.name = option.name),
      (this.id = option.id),
      (this.text = option.text),
      (this.paragraphe = option?.paragraphe),
      (this.avertissement = option.avertissement),
      (this.image = option.image),
      (this.title = option.title),
      (this.full_page = option.full_page),
      (this.image_text = option.image_text),
      (this.is_carroussel = option.is_carroussel),
      (this.isFullHeight = option.isFullHeight),
      (this.link = option.link),
      (this.text_height = option.text_height);
  }
}

export class Paragraphe {
  public text: string;
  public title: string;
  public icon: string;
  public link: string;
  public text_link: string;
  public liste: Liste[];
  public image: string;
  public image_text: string;
  public phone: string;
  public mail: string;
  public isList: boolean;
  public avertissement: string;

  constructor(option: Paragraphe) {
    (this.text = option.text),
      (this.avertissement = option.avertissement),
      (this.title = option.title),
      (this.icon = option.icon),
      (this.liste = option.liste),
      (this.link = option.link),
      (this.text_link = option.text_link),
      (this.image = option.image),
      (this.phone = option.phone),
      (this.mail = option.mail),
      (this.isList = option.isList),
      (this.image_text = option.image_text);
  }
}

export class Liste {
  public text: string;
  public title: string;
  public icon: string;
  public link: string;
  public text_link: string;
  public image: string;
  public image_text: string;
  public isList: boolean;
  public italic: boolean;
  public bold: boolean;
  public isCenter: boolean;
  public isSize: boolean;
  public height: string;
  public width: string;

  constructor(option: Liste) {
    (this.text = option.text),
      (this.title = option.title),
      (this.icon = option.icon),
      (this.link = option.link),
      (this.text_link = option.text_link),
      (this.image = option.image),
      (this.image_text = option.image_text),
      (this.isList = option.isList),
      (this.italic = option.italic),
      (this.bold = option.bold),
      (this.isSize = option.isSize),
      (this.height = option.height),
      (this.width = option.width),
      (this.isCenter = option.isCenter);
  }
}

export interface Icontent {
  name: string;
  id: string;
  text: string;
  paragrapge: Paragraphe;
  isList: boolean;
}


