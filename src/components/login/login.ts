import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  username = '';
  password = '';
  loginError = false;

  constructor(private apiService: ApiService, private router: Router) { }

  onLogin(): void {
    this.apiService.login(this.username, this.password).subscribe(user => {
      if (user) {
        // Authentification réussie
        localStorage.setItem('currentUser', JSON.stringify(user)); // Stocker l'utilisateur
        this.router.navigate(['/']); // Rediriger vers le tableau de bord
      } else {
        this.loginError = true;
      }
    });
  }
}
