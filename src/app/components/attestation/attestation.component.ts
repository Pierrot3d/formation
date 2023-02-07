import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent implements OnInit {
  batonnier!: string;
  name!: string;
  surname!: string;
  specificformation!: string;
  signature!: string;

  ngOnInit(){
    this.batonnier = 'PHILIPPE BARON'
    this.name = 'EXEMPLE'
    this.surname = 'AVOCAT'
    this.specificformation = 'FORMATION'
    this.signature = 'SIGNATURE'
  }

}  




