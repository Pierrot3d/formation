import { Component, EventEmitter, HostBinding, HostListener, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogData } from '../../table/table/table.component';
import { HttpClient } from '@angular/common/http';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogUpdateTrombinoscope',
  templateUrl: './dialogUpdateTrombinoscope.component.html',
  styleUrls: ['./dialogUpdateTrombinoscope.component.css']
})
export class DialogUpdateTrombinoscopeComponent   {

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFileDropped = new EventEmitter<any>();



  fileName = '';
  files: any = [];


  constructor(
    public dialogRef: MatDialogRef<DialogUpdateTrombinoscopeComponent>,
    private bddCommunicationService: BddCommunicationService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}


  updateUser() {
    this.bddCommunicationService.updateTrombinoscopeUser(
      this.data.id,
      this.data.imageUrl,
      this.data.nom,
      this.data.prenom,
      this.data.serment,
      this.data.casePalais,
      this.data.adresse,
      this.data.telephone,
      this.data.email,
    );
  }

  onFileSelected(event)
  {
    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append('file', file, this.fileName);

        const upload$ = this.http.post("../../../../assets/img/avocats", formData);

        upload$.subscribe();
    }  }




    @HostBinding('style.background-color') private background = '#f5fcff'
    @HostBinding('style.opacity') private opacity = '1'

    //Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#9ecbec';
      this.opacity = '0.8'
    }

    //Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#f5fcff'
      this.opacity = '1'
    }

    //Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#f5fcff'
      this.opacity = '1'
      const files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.onFileDropped.emit(files)
      }
    }


  uploadFile(event) {
    const evenTmp = event
    event = event.target.files
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }

    this.onFileSelected(evenTmp)
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
