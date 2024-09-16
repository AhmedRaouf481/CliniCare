import {Component, OnDestroy, OnInit} from '@angular/core';
import {Doctor} from "../../interfaces/doctor";
import {DoctorService} from "../../services/doctor/doctor.service";
import {RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../services/auth/authentication.service";

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit, OnDestroy {
  doctor!: Doctor;
  subs: Subscription[] = [];

  constructor(private _doctorService: DoctorService) {
  }

  ngOnInit(): void {
    this.loadDoctor();
  }

  loadDoctor(): void {
    const sub = this._doctorService.getDoctor().subscribe({
      next: (res: Doctor) => {
        this.doctor = res;
        console.log(res);
      }, error(err: any) {
        console.log("error fetching doctor \n", err.message)
      }
    })
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }


}
