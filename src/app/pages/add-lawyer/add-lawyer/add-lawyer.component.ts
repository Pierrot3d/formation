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
    this.excelService.saveLawyersToServer(this.excelForm.value);
    this.excelService.getLawyersFromServer();
  }
  generatePeople() {
    this.excelService.getLawyersFromServer();
    console.log(this.excelService.getLawyersFromServer())
  }
  generateExcel() {
    this.excelService.generateExcel();
  }
}
