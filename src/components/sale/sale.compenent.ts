import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Medicine } from '../../models/medicine';
import { Sale } from '../../models/sale';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sale',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sale.html',
  styleUrl: './sale.scss'
})
export class SaleComponent implements OnInit {
  saleForm: FormGroup;
  medicines: Medicine[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.saleForm = this.fb.group({
      medicine: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.apiService.getMedicines().subscribe(data => {
      this.medicines = data;
    });
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const selectedMedicine = this.saleForm.get('medicine')?.value as Medicine;
      const quantitySold = this.saleForm.get('quantity')?.value as number;

      if (quantitySold > selectedMedicine.quantity) {
        alert('Erreur : La quantité vendue est supérieure au stock disponible.');
        return;
      }

      // 1. Enregistrer la vente
      const newSale: Sale = {
        id: Date.now().toString(), // ID unique pour la vente
        medicineId: selectedMedicine.id,
        quantity: quantitySold,
        date: new Date().toISOString()
      };

      this.apiService.addSale(newSale).subscribe({
        next: (saleData) => {
          console.log('Vente enregistrée :', saleData);

          // 2. Décrémenter le stock du médicament
          const updatedMedicine: Medicine = {
            ...selectedMedicine,
            quantity: selectedMedicine.quantity - quantitySold
          };

          this.apiService.updateMedicine(updatedMedicine).subscribe({
            next: () => {
              alert('Vente et mise à jour du stock réussies !');
              this.router.navigate(['/']); // Revenir à la page d'accueil
            },
            error: (e) => console.error('Erreur lors de la mise à jour du stock', e)
          });
        },
        error: (e) => console.error('Erreur lors de l\'enregistrement de la vente', e)
      });
    }
  }
}
