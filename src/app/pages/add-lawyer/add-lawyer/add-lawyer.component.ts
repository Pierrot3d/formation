import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';

@Component({
  templateUrl: './add-lawyer.component.html',
  styleUrls: ['./add-lawyer.component.scss']
})
export class AddLawyerComponent implements OnInit {

  @Input() isDownload: boolean = false;
  excelForm!: FormGroup;

  constructor(
    public bddCommunicationService: BddCommunicationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.bddCommunicationService.isRecord = false;
    this.excelForm = this.formBuilder.group({
      nom: ['',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]
    ],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      // cocktail: [false],
      // brunch: [false],
      // restrictionAlimentaires: [''],
    });
  }

  formulaireValidation() {
    this.bddCommunicationService.saveLawyersToServer(this.excelForm.value);
    this.bddCommunicationService.getLawyersFromServer();
  }
  generatePeople() {
    this.bddCommunicationService.getLawyersFromServer();
    console.log(this.bddCommunicationService.getLawyersFromServer())
  }
  // generateExcel() {
  //   this.excelService.generateExcel();
  // }
}
