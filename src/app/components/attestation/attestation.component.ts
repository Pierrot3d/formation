import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent implements OnInit {
  @Input() batonnier!: string;
  @Input() name!: string;
  @Input() surname!: string;
  @Input() specificformation!: string;
  @Input() signature!: string;

  ngOnInit(){
    this.batonnier = 'PHILIPPE BARON'
    this.name = 'EXEMPLE'
    this.surname = 'AVOCAT'
    this.specificformation = 'FORMATION'
    this.signature = 'SIGNATURE'
  }

}




