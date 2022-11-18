import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() src: string;
  @Input() text: string;
  @Input() isFullPageImage: boolean;
  @Input() isFullHeight: boolean;
  @Input() link: string;
  @Input() height: string;
  @Input() width: string;
  @Input() textHeight: string;

  constructor(private route: Router) {}

  ngOnInit(): void {}
}
