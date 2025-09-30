import { Component } from '@angular/core';
import { SideBar } from '../../shared/side-bar/side-bar';

@Component({
  selector: 'app-layout-dashboard',
  imports: [SideBar],
  templateUrl: './layout-dashboard.html',
  styleUrl: './layout-dashboard.css',
})
export class LayoutDashboard {}
