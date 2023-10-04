import { Component, Input } from '@angular/core';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';

@Component({
  selector: 'app-spin-box',
  templateUrl: './spin-box.component.html',
  styleUrls: ['./spin-box.component.css']
})
export class SpinBoxComponent   {

  constructor(private bddCommunicationService: BddCommunicationService) {}
  @Input() value: number;
  @Input() lawyerId;
  @Input() isReportedHours;
  @Input() backgroundColor;


numberIncrement(element: number)
{
  if(this.value)
  {
    const nbr = element + 1;
    this.value = nbr
    this.bddCommunicationService.updateNbrDay(this.lawyerId, this.value)
  }
  else
  {
    this.value = 0
    const nbr = this.value + 1;
    this.bddCommunicationService.updateNbrDay(this.lawyerId, nbr)
  }

}

numberDecrement(element: number)
{
  if(element > 0)
  {
    if(this.value)
    {
      const nbr = element - 1;
      this.value = nbr
      this.bddCommunicationService.updateNbrDay(this.lawyerId, this.value)
    }
    else
    {
      this.value = 0
      const nbr = this.value - 1;
      this.bddCommunicationService.updateNbrDay(this.lawyerId, nbr)
    }
  }
  else
  {
    return
  }
}



numberIncrementReport(element: number)
{
  if(this.value)
  {
    const nbr = element + 1;
    this.value = nbr
    this.bddCommunicationService.updateNbrHoursReport(this.lawyerId, this.value)
  }
  else
  {
    this.value = 0
    const nbr = this.value + 1;
    this.bddCommunicationService.updateNbrHoursReport(this.lawyerId, nbr)
  }

}

numberDecrementReport(element: number)
{
  if(element > 0)
  {
    if(this.value)
    {
      const nbr = element - 1;
      this.value = nbr
      this.bddCommunicationService.updateNbrHoursReport(this.lawyerId, this.value)
    }
    else
    {
      this.value = 0
      const nbr = this.value - 1;
      this.bddCommunicationService.updateNbrHoursReport(this.lawyerId, nbr)
    }
  }
  else
  {
    return
  }
}

}
