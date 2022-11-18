import { Component, Input, OnDestroy, OnInit } from '@angular/core';



@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  @Input() birthdayDate: string;
  @Input() title: string;

  days
  hours
  minutes
  seconds
  id
  x

  constructor() {

  }

  ngOnInit() {
    // Set the date we're counting down to
    let countDownDate = new Date(this.birthdayDate).getTime();
    let id = Math.random()
    this.id = id
    // Update the count down every 1 second

    this.x = setInterval(function () {

      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"

      document.getElementById("days" + id).innerHTML = JSON.stringify(days),
        document.getElementById("hours" + id).innerHTML = JSON.stringify(hours),
        document.getElementById("minutes" + id).innerHTML = JSON.stringify(minutes),
        document.getElementById("seconds" + id).innerHTML = JSON.stringify(seconds);


      // If the count down is finished, write some text
      if (distance < 0) {

      }
    }, 1000);



  }

  ngOnDestroy() {
    clearInterval(this.x);
  }
}

