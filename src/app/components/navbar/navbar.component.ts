import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from "../../services/auth/authentication.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public router: Router, public authService: AuthenticationService, public route: ActivatedRoute) {
  }


  logout(): void {
    this.authService.logout().subscribe(
      success => {
        if (success) {
          console.log('Logged out successfully');
        } else {
          console.log('Logout failed on the server side');
        }
      }
    );
  }
}
