import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Medicine } from '../../models/medicine';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-medicine-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './medicine-form.html',
  styleUrl: './medicine-form.scss'
})

export class MedicineForm implements OnInit {
  medicineForm: FormGroup;
  isEditMode = false;
  medicineId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      expirationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.isEditMode = true;
      this.medicineId = id;
      this.loadMedicine(this.medicineId);
    }
  });
}

   loadMedicine(id: string): void {
    this.apiService.getMedicineById(id).subscribe({
      next: (medicine) => {
        this.medicineForm.patchValue(medicine);
      },
      error: (e) => console.error('Erreur lors du chargement du médicament', e)
    });
  }

  onSubmit(): void {
  if (this.medicineForm.valid) {
    if (this.isEditMode) {
      const updatedMedicine: Medicine = {
        id: this.medicineId!,
        ...this.medicineForm.value
      };
      this.apiService.updateMedicine(updatedMedicine).subscribe({
        next: () => this.router.navigate(['/medicines']),
        error: (e) => console.error('Erreur lors de la mise à jour', e)
      });
    } else {
      this.apiService.getNextMedicineId().subscribe(newId => {
        const newMedicine: Medicine = {
          id: newId,
          ...this.medicineForm.value
        };
        this.apiService.addMedicine(newMedicine).subscribe({
          next: () => this.router.navigate(['/medicines']),
          error: (e) => console.error('Erreur lors de l\'ajout', e)
        });
      });
    }
  } else {
    console.log('Formulaire invalide.');
  }
}
}

