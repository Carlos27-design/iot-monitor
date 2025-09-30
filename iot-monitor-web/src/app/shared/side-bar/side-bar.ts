import { Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { MaterialModule } from '../material/material-module';
import { rxResource } from '@angular/core/rxjs-interop';
import { DeviceData } from '../../core/services/device-data';
import { Device } from '../../core/interfaces/device.interface';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthData } from '../../core/services/auth-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

type drawerType = 'side' | 'over';

@Component({
  selector: 'app-side-bar',
  imports: [
    MaterialModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private _drawerMode = signal<drawerType>('side');
  private _isDrawerOpen = signal<boolean>(true);
  private readonly deviceData = inject(DeviceData);
  public authData = inject(AuthData);
  public router = inject(Router);

  @HostListener('window:resize')
  updateDrawerMode() {
    if (window.innerWidth < 768) {
      this._drawerMode.set('over');
      this._isDrawerOpen.set(false);
    } else {
      this._drawerMode.set('side');
      this._isDrawerOpen.set(true);
    }
  }

  public devicesResource = rxResource({
    stream: () => this.deviceData.getDevices(),
  });

  public get isDrawerOpen(): boolean {
    return this._isDrawerOpen();
  }

  public set isDrawerOpen(value: boolean) {
    this._isDrawerOpen.set(value);
  }

  public drawerMode = computed(() => this._drawerMode());

  public selectDevice(device: Device) {
    if (device && this.drawerMode() === 'over') {
      this._isDrawerOpen.set(false);
    }
  }

  public logout() {
    this.authData.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
