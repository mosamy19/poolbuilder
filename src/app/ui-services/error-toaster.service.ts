import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorToasterService {
  constructor(public toastController: ToastController) {}
  async presentToast(msg = 'An error occurred please try again later.' ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
