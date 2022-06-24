// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig: {
    apiKey: "AIzaSyCRIvVinB3PxHqmCx6ncrHbQYemvRAO3jY",
    authDomain: "gestionar-gastos.firebaseapp.com",
    projectId: "gestionar-gastos",
    storageBucket: "gestionar-gastos.appspot.com",
    messagingSenderId: "519785918958",
    appId: "1:519785918958:web:135830cbfdf7ddfa6d5eff"
  },

  RG_FUNC_PATH: "https://us-central1-gestionar-gastos.cloudfunctions.net/regressionReq",
  googleWebClientId : "519785918958-jfm7103u07hu0sfoprgku3jvp7kk7ire.apps.googleusercontent.com"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
