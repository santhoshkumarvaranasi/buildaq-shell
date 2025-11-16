import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { 
  NbThemeModule, 
  NbLayoutModule, 
  NbSidebarModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbButtonModule,
  NbIconModule,
  NbCardModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),
      NbLayoutModule,
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbUserModule,
      NbActionsModule,
      NbButtonModule,
      NbIconModule,
      NbCardModule,
      NbEvaIconsModule
    )
  ]
};
