import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterLinkActive,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  searchQuery = '';

  constructor(private router: Router) {}
  
  isLoggedIn(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user && user.role === 'admin';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    window.location.reload();
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.router.navigate(['/medicines'], { queryParams: { q: this.searchQuery } });
    }
  }
}
