import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonNote,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { passwordsMatch } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonNote
  ]
})
export class RegisterPage {
  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordsMatch });
  }

  get name() { return this.form.get('name')!; }
  get surname() { return this.form.get('surname')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, surname, email, password } = this.form.value;
    const loading = await this.loadingCtrl.create({ message: 'Creating account...' });
    await loading.present();

    try {
      await this.auth.register(email, password, `${name} ${surname}`.trim());
      await loading.dismiss();
      await this.showToast('Account created successfully!', 'success');
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      const message = error instanceof Error ? error.message : 'Registration failed.';
      await this.showToast(message, 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}
