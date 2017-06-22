// describe('apiUrl', () => {
//   let apiUrl;
//   let mockApiHost;
//   const path = '/campuses';

//   beforeEach(module('apiUrl'));

//   beforeEach(function() {
//     mockApiHost = 'http://localhost:8080';

//     module(function ($provide) {
//       $provide.value('apiHost', mockApiHost);
//     });
//   });

//   beforeEach(inject((_apiUrl_) => {
//     apiUrl = _apiUrl_;
//   }));

//   it('should return value from mock API host', inject(function (apiUrl) {
//     console.log(`path = ${path}`);
//     expect(apiUrl(path)).toBeDefined();
//   }));

//   // it('should return the api URL', () => {
//   //   expect(apiUrl(path)).toBeDefined();
//   // });
// });
