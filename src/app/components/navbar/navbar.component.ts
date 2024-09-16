import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isDropdownVisible = false;
  currentRole: string; // Default role

  constructor(
    public router: Router,
    public authService: AuthenticationService,
    public route: ActivatedRoute
  ) {
    this.currentRole = this.authService.getCurrentRole();
  }

  // Function to switch between roles
  switchRole(role: string) {
    this.currentRole = role;
    this.authService.setCurrentRole(role);
    
  const currentUrl = this.router.url;

  // Check if the current route is the profile page
  if (currentUrl.includes('/profile')) {
    // Navigate to the profile of the selected role
    this.router.navigate([`/${role}/profile`]);
  } else {
    // Reload the current page
    window.location.reload();
  }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logout(): void {
    this.authService.logout().subscribe((success) => {
      if (success) {
        console.log('Logged out successfully');
      } else {
        console.log('Logout failed on the server side');
      }
    });
  }
}
