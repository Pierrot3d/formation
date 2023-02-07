import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from './section/section.component';
import { ParagrapheComponent } from './section/paragraphe/paragraphe.component';
import { ImageModule } from '../image/image.module';
import { ExcelModule } from '../excel/excel.module';
import { CarrousselComponent } from './section/carroussel/carroussel.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SectionComponent, ParagrapheComponent, CarrousselComponent],
  imports: [CommonModule, ImageModule, ExcelModule, RouterModule],
  exports: [SectionComponent],
})
export class SectionModule { }
