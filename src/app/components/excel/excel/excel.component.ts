import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormExcel } from 'src/app/models/excel.model';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss'],
})
export class ExcelComponent implements OnInit {
  @Input() isDownload: boolean = false;
  excelForm!: FormGroup;

  json_data = [
    {
      name: 'Raja',
      age: 20,
    },
    {
      name: 'Mano',
      age: 40,
    },
    {
      name: 'Tom',
      age: 40,
    },
    {
      name: 'Devi',
      age: 40,
    },
    {
      name: 'Mango',
      age: 40,
    },
  ];

  constructor(
    public excelService: ExcelService,
    private formBuilder: FormBuilder,
    public bddCommunicationService: BddCommunicationService
  ) { }

  ngOnInit(): void {
    this.excelService.isRecord = false;
    this.excelForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      // cocktail: [false],
      // brunch: [false],
      // restrictionAlimentaires: [''],
    });
  }

  formulaireValidation() {
    console.log('données du formulaire ..', this.excelForm.value);
    this.bddCommunicationService.saveLawyersToServer(this.excelForm.value);
    this.bddCommunicationService.getLawyersFromServer();
  }
  generatePeople() {
    this.bddCommunicationService.getLawyersFromServer();
  }
  generateExcel() {
    this.excelService.generateExcel();
  }
}
