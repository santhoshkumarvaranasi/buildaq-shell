# BuildAQ Shell Application

This is the main shell application for the BuildAQ multi-domain platform using Module Federation.

## Features

- ✅ Angular 18 with Module Federation (Working)
- ✅ Custom layout and navigation (Nebular-free)
- ✅ Mock authentication service (ready for Azure AD B2C integration)
- ✅ Dynamic remote loading service
- ✅ Dashboard with working Module Federation integration
- ✅ Schools remote module loading (Connected to buildaq-schools)

## Development server

To start a local development server, run:

```bash
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Architecture

This shell application serves as the host for multiple micro-frontend domains:

- **Schools Management**: ✅ Educational institution management (Remote on port 4201) - **WORKING**
- **Healthcare System**: Medical facility management (Coming soon)
- **Real Estate Portal**: Property management system (Coming soon)

## Current Status: ✅ WORKING

Both shell (port 4200) and schools remote (port 4201) are successfully running and integrated with Module Federation.

## Module Federation

The application uses Webpack Module Federation to dynamically load remote applications:

- Host: buildaq-shell (port 4200)
- Remote: buildaq-schools (port 4201)

## Authentication

Currently using mock authentication. Ready for integration with:
- Azure AD B2C
- Auth0
- IdentityServer

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Deployment

Ready for deployment to:
- Azure Static Web Apps
- AWS S3 + CloudFront
- Netlify
- GitHub Pages

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
