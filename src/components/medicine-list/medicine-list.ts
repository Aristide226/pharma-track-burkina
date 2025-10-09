import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../services/api.service';
import { Medicine } from '../../models/medicine';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-list.html',
  styleUrl: './medicine-list.scss'
})
export class MedicineList implements OnInit{
  medicines: Medicine[] = [];
  lowStockMedicines: Medicine[] = []; // Pour les alertes de rupture
  allMedicines: Medicine[] = [];
  isAdminUser: boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.checkUserRole(); 
    this.route.queryParams.pipe(
      switchMap(params => {
        const query = params['q']?.toLowerCase();
        return this.apiService.getMedicines().pipe(
          map((data:any) => {
            this.allMedicines = data;
            this.checkLowStock();
            if (query) {
              return this.allMedicines.filter(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));
            }
            return this.allMedicines;
          })
        );
      })
    ).subscribe(filteredMedicines => {
      this.medicines = filteredMedicines;
    });
  }

  checkUserRole(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdminUser = user && user.role === 'admin';
  }

  getMedicines(): void {
    this.apiService.getMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.checkLowStock();
      },
      error: (e) => console.error(e)
    });
  }

    deleteMedicine(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      this.apiService.deleteMedicine(id).subscribe({
        next: () => {
          this.getMedicines();
        },
        error: (e) => console.error(e)
      });
    }
  }

  private checkLowStock(): void {
    this.lowStockMedicines = this.allMedicines.filter(m => m.quantity < 10);
  }

  onBuyMedicine(medicineId: string): void {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      alert('Veuillez vous connecter pour effectuer un achat.');
      this.router.navigate(['/login']);
      return;
    }
    const currentUser = JSON.parse(user);
    if (currentUser.role !== 'admin') {
      alert("Seuls les administrateurs peuvent enregistrer une vente.");
    //this.router.navigate(['/login']);
    return;
    }
    this.router.navigate(['/sales']);
  }
    
}
