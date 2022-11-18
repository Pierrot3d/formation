import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, RouterModule],
  exports: [ImageComponent],
})
export class ImageModule { }
