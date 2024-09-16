import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import {SidenavComponent} from "./components/sidenav/sidenav.component";
import { AuthenticationService } from './services/auth/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidenavComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  /**
   *
   */
  constructor(public authService:AuthenticationService) {}
}
