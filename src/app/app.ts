import { Component, signal } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { RemoteReloadService } from './core/services/remote-reload.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: '<app-layout></app-layout>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('buildaq-shell');
  constructor(_reload: RemoteReloadService) {}
}
