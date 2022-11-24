import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  templateUrl: './add-lawyer.component.html',
  styleUrls: ['./add-lawyer.component.scss']
})
export class AddLawyerComponent implements OnInit {

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
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.excelService.isRecord = false;
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
    console.log('données du formulaire ..', this.excelForm.value);
    this.excelService.saveAppareilsToServer(this.excelForm.value);
    this.excelService.getAppareilsFromServer();
  }
  generatePeople() {
    this.excelService.getAppareilsFromServer();
    console.log(this.excelService.getAppareilsFromServer())
  }
  generateExcel() {
    this.excelService.generateExcel();
  }
}
