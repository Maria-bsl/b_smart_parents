// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  nmbTokenBaseUrl: 'http://183.83.33.156:92/Mobile/api',
  googleMapApiKey: 'AIzaSyBXeOCuK5n8odFY905hUBAZXJzhOmjCpow',
  airtel: {
    clientID: 'c7f60bd5-1a99-4a89-baaa-a6a37e28d133',
    clientSecret: '****************************',
  },
  stripe: {
    publicKey:
      'pk_test_51QQ4JPIMOYuzMgkqCAZAGAyvgVlNMhdhupIi6jDmYo76fE3oFYvOQ6ODcRHjVjAEYBOLMz3cG8mLsQ86LNWAiadC00npGEOcpK',
    secretKey:
      'sk_test_51QQ4JPIMOYuzMgkq9iAlMNhxMdeEFhVA2JuWm1XbLK8duCAZIyiOsRNqwLV5nGhabDO6vZcLpjjzYqkfipDfSRQF00qEFPiqMe',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
