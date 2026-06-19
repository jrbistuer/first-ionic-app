import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonNote,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonNote
  ]
})
export class LoginPage {
  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    const loading = await this.loadingCtrl.create({ message: 'Signing in...' });
    await loading.present();

    try {
      const user = await this.auth.login(email, password);
      console.log('Logged in user:', user);
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      const message = error instanceof Error ? error.message : 'Sign-in failed.';
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
