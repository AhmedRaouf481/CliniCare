import {Component, OnDestroy, OnInit} from '@angular/core';
import {Doctor} from "../../interfaces/doctor";
import {DoctorService} from "../../services/doctor/doctor.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";

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

  constructor(private _doctorService: DoctorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const route = this.route.params.subscribe(params => {
      const doctor_id = +params['id'];
      this.loadDoctor(doctor_id);
    });
    this.subs.push(route);
  }

  loadDoctor(doctor_id: number): void {
    const sub = this._doctorService.getDoctor(doctor_id).subscribe({
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
