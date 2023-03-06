import { Component } from '@angular/core';
import { PauseOutlined } from '@material-ui/icons';
import { FormExcel } from 'src/app/models/excel.model';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-tabletest',
  templateUrl: './tabletest.component.html',
  styleUrls: ['./tabletest.component.scss']
})
export class TabletestComponent {

}

async function ajout_donnees(){
  await Excel.run (async (context) => {
    let feuille = context.workbook.worksheets.getActiveworksheets();
    let tableaudonnees = feuille.tables.add('A1:D1', true);
    tableaudonnees.name = 'tableaudonnees';
    tableaudonnees.getHeaderrowrange().values = [['Avocat', 'NbrDeJourDeFormation', 'specialite']];
  
var data = [
  {
    Avocat : 'personne 1' ,
    NbrDeJourDeFormation : 6,
    specialite : 'true'
  },
  {
    Avocat : 'personne 2' ,
    NbrDeJourDeFormation : 4,
    specialite : 'true'
  },
  {
    Avocat : 'personne 3',
    NbrDeJourDeFormation : 3,
    specialite : 'false'

  },
  {
    Avocat : 'personne 4',
    NbrDeJourDeFormation : 6,
    specialite : 'false'
  }

];
let nouvellesdonnees = data.map((item) =>[item.Avocat , item.NbrDeJourDeFormation , item.specialite]);

tableaudonnees.rows.add(null, nouvellesdonnees);

});
}