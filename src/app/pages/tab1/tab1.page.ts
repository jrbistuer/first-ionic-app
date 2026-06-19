import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, logOutOutline } from 'ionicons/icons';
import { CameraService } from '../../services/camera.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonImg],
})
export class Tab1Page {
  photoUri?: string;

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private cameraService: CameraService) {
    addIcons({ camera, logOutOutline });
  }

  async takePhoto() {
    const photo = await this.cameraService.takePhoto();
    this.photoUri = photo.webPath;
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
