import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PrayerText } from 'src/app/models/prayer_text';
import { Professional } from 'src/app/models/professional';
import { SettlementHoliday } from 'src/app/models/settlement-holiday';
import { OpenSchedulingService } from '../open-scheduling.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SchedulingService } from '../../../scheduling.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailsVolunteerToHolidayComponent } from '../details-volunteer-to-holiday/details-volunteer-to-holiday.component';

export interface DialogData {
  settlement: number;
  scheduling: number;
}
@Component({
  selector: 'app-details-settlement-to-holiday',
  templateUrl: './details-settlement-to-holiday.component.html',
  styleUrls: ['./details-settlement-to-holiday.component.css']
})
export class DetailsSettlementToHolidayComponent implements OnInit {

  ngOnInit(): void {
    let holiday=Number(sessionStorage.getItem("holiday")) 
    this.professionals$=this._SchedulingService.getProfessionalsByHoliday(holiday)
    this.prayerTexts$=this._SchedulingService.getPrayerTexts()
  }

  constructor(private _openSchedulingService:OpenSchedulingService,private fb:FormBuilder,
    private _SchedulingService : SchedulingService,
    public dialogRef: MatDialogRef<DetailsVolunteerToHolidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  settlement:SettlementHoliday
  professionals$:Observable<Professional[]>
  prayerTexts$:Observable<PrayerText[]>

  settlementHolidayForm:FormGroup=new FormGroup({
    amountPeopleConsumed:new FormControl(0),
    idPrayer :new FormControl(Validators.required),
    isSynagogue:new FormControl(false),
    isSeferTora:new FormControl(false),
    additionalNeeds :new FormControl(""),
    professionals: new FormControl([]),
  })

  addSettlementHoliday(){
    this.settlement=this.settlementHolidayForm.value
    this.settlement.idSchedulingHoliday=this.data.scheduling
    this.settlement.idSettlement=this.data.settlement
    this._openSchedulingService.addSettlementHoliday(this.settlement).subscribe(result=>{
      if(result){
        console.log('הפעיל נוסף בהצלחה')
      }
      else{
        console.log("הפעיל כבר קיים בשיבוץ זה")
      }
    })
  }

}
