import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: '<app-layout></app-layout>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('buildaq-shell');
}
