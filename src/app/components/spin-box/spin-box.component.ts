import { Component } from '@angular/core';

@Component({
  selector: 'app-spin-box',
  templateUrl: './spin-box.component.html',
  styleUrls: ['./spin-box.component.css']
})
export class SpinBoxComponent   {

  constructor() {}

  value = 1;

numberIncrement(element: number)
{
  const nbr = element + 1;
  this.value = nbr
}

numberDecrement(element: number)
{
  if(element > 0)
  {
    const nbr = element - 1;
    this.value = nbr
  }
  else
  {
    return
  }
}


}
