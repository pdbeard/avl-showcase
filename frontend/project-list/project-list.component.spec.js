describe('projectList', () => {
  beforeEach(module('projectList'));

  describe('ProjectListController', () => {
    let $httpBackend;
    let ctrl;
    const url = 'http://localhost:8080';
    const mockCampuses = [
      { id: 1, name: 'IU Bloomington' },
      { id: 2, name: 'IU East' },
      { id: 3, name: 'IU Kokomo' },
    ];
    const mockCategories = [
      { id: 1, name: 'Virtual Reality' },
      { id: 2, name: 'Augmented Reality' },
      { id: 3, name: '3D Digitization' },
    ];
    const mockDisciplines = [
      { id: 1, name: 'Science and Mathematics' },
      { id: 2, name: 'Engineering and Technology' },
      { id: 3, name: 'Informatics and Computing' },
    ];
    const mockProjects = [
      { campus_ids: [7, 1], category_ids: [8], discipline_ids: [15], tags: ['definition', 'Versatile'], id: 'fe4cb1d025bd7c4bbd7845ffd36a2f2045b246f5', title: 'Tin', description: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', year: 2010, url: 'http://reuters.com/accumsan/odio/curabitur/convallis.html', people: 'Victor--Gomez' },
      { campus_ids: [9, 2], category_ids: [9, 6], discipline_ids: [], tags: [], id: '92902058ab0b59886feb773522610c52ccb1f8ac', title: 'Tampflex', description: 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', year: 2010, url: 'http://php.net/eu/mi/nulla.xml', people: 'Jeffrey--Rivera' },
      { campus_ids: [8], category_ids: [2], discipline_ids: [20, 9], tags: [], id: 'de2032294eaf524ba62d1d5120552e31f8ca2264', title: 'Gembucket', description: 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', year: 2003, url: 'http://comsenz.com/vulputate/ut/ultrices.png', people: 'Carl--Owens' },
    ];
    const mockSearchResults = mockProjects;

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(($componentController, _$httpBackend_) => {
      $httpBackend = _$httpBackend_;
      ctrl = $componentController('projectList');
    }));

    it('should get campuses', () => {
      expect(ctrl.campuses).toEqual([]);
      $httpBackend.expectGET(`${url}/campuses`).respond(mockCampuses);
      $httpBackend.flush();
      expect(ctrl.campuses).toEqual(mockCampuses);
    });

    it('should get categories', () => {
      expect(ctrl.categories).toEqual([]);
      $httpBackend.expectGET(`${url}/categories`).respond(mockCategories);
      $httpBackend.flush();
      expect(ctrl.categories).toEqual(mockCategories);
    });

    it('should get disciplines', () => {
      expect(ctrl.disciplines).toEqual([]);
      $httpBackend.expectGET(`${url}/disciplines`).respond(mockDisciplines);
      $httpBackend.flush();
      expect(ctrl.disciplines).toEqual(mockDisciplines);
    });

    it('should get projects', () => {
      expect(ctrl.projects).toEqual([]);
      $httpBackend.expectGET(`${url}/projects`).respond(mockProjects);
      $httpBackend.flush();
      expect(ctrl.projects).toEqual(mockProjects);
    });

    it('should search projects', () => {
      expect(ctrl.searchString).toEqual('');
      expect(ctrl.projects).toEqual([]);
      ctrl.searchString = 'test';
      ctrl.updateSearch();
      const query = { query_string: 'test' };
      $httpBackend.expectPOST(`${url}/search`, query).respond(mockSearchResults);
      $httpBackend.flush();
      expect(ctrl.projects).toEqual(mockSearchResults);
    });
  });
});
