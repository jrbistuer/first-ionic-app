import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonImg],
})
export class Tab1Page {
  photoUri?: string;

  constructor(private cameraService: CameraService) {
    addIcons({ camera });
  }

  async takePhoto() {
    const photo = await this.cameraService.takePhoto();
    this.photoUri = photo.webPath;
  }
}
