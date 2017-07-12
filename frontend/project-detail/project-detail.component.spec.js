describe('projectDetail', () => {
  beforeEach(module('projectDetail'));

  describe('ProjectDetailController', () => {
    let $httpBackend;
    let $location;
    let ctrl;
    const url = 'http://localhost:8080';
    const mockProject = { campus_ids: [1, 3], category_ids: [2, 3], discipline_ids: [1, 2], tags: ['definition', 'Versatile'], id: 'fe4cb1d025bd7c4bbd7845ffd36a2f2045b246f5', title: 'Tin', description: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', year: 2010, url: 'http://reuters.com/accumsan/odio/curabitur/convallis.html', people: 'Victor--Gomez' };
    const mockPeople = 'Victor--Gomez';
    const mockPeopleObjects = [{ name_first: 'Victor', name_last: 'Gomez' }];
    const mockCampuses = [
      { id: 1, name: 'IU Bloomington' },
      { id: 2, name: 'IU East' },
      { id: 3, name: 'IU Kokomo' },
    ];
    const mockCampusIds = [1, 3];
    const mockCampusNames = ['IU Bloomington', 'IU Kokomo'];
    const mockCategories = [
      { id: 1, name: 'Virtual Reality' },
      { id: 2, name: 'Augmented Reality' },
      { id: 3, name: '3D Digitization' },
    ];
    const mockCategoryIds = [2, 3];
    const mockCategoryNames = ['Augmented Reality', '3D Digitization'];
    const mockDisciplines = [
      { id: 1, name: 'Science and Mathematics' },
      { id: 2, name: 'Engineering and Technology' },
      { id: 3, name: 'Informatics and Computing' },
    ];
    const mockDisciplineIds = [1, 2];
    const mockDisciplineNames = ['Science and Mathematics', 'Engineering and Technology'];

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(($componentController, _$httpBackend_, $routeParams, _$location_) => {
      $httpBackend = _$httpBackend_;
      $routeParams.projectId = '000';
      ctrl = $componentController('projectDetail');
      $location = _$location_;
      spyOn($location, 'url').and.returnValue(`/projects/${ctrl.projectId}`);
    }));

    it('should get project id from routeParams', () => {
      expect(ctrl.projectId).toBeDefined();
      expect(ctrl.projectId).toBe('000');
    });

    it('should get project', () => {
      expect(ctrl.project).toEqual({});
      $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
      $httpBackend.flush();
      expect(ctrl.project).toEqual(mockProject);
    });

    it('should create peopleObjects', () => {
      expect(ctrl.peopleObjects).toEqual([]);
      ctrl.project.people = mockPeople;
      ctrl.createPeopleObjects();
      expect(ctrl.peopleObjects).toEqual(mockPeopleObjects);
    });

    it('should get campuses', () => {
      expect(ctrl.campuses).toEqual([]);
      $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
      $httpBackend.expectGET(`${url}/campuses`).respond(mockCampuses);
      $httpBackend.flush();
      expect(ctrl.campuses).toEqual(mockCampuses);
    });

    it('should create campusNames', () => {
      expect(ctrl.campusNames).toEqual([]);
      ctrl.campuses = mockCampuses;
      ctrl.project.campus_ids = mockCampusIds;
      ctrl.createCampusNames();
      expect(ctrl.campusNames).toEqual(mockCampusNames);
    });

    it('should get categories', () => {
      expect(ctrl.categories).toEqual([]);
      $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
      $httpBackend.expectGET(`${url}/categories`).respond(mockCategories);
      $httpBackend.flush();
      expect(ctrl.categories).toEqual(mockCategories);
    });

    it('should create categoryNames', () => {
      expect(ctrl.categoryNames).toEqual([]);
      ctrl.categories = mockCategories;
      ctrl.project.category_ids = mockCategoryIds;
      ctrl.createCategoryNames();
      expect(ctrl.categoryNames).toEqual(mockCategoryNames);
    });

    it('should get disciplines', () => {
      expect(ctrl.disciplines).toEqual([]);
      $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
      $httpBackend.expectGET(`${url}/disciplines`).respond(mockDisciplines);
      $httpBackend.flush();
      expect(ctrl.disciplines).toEqual(mockDisciplines);
    });

    it('should create disciplineNames', () => {
      expect(ctrl.disciplineNames).toEqual([]);
      ctrl.disciplines = mockDisciplines;
      ctrl.project.discipline_ids = mockDisciplineIds;
      ctrl.createDisciplineNames();
      expect(ctrl.disciplineNames).toEqual(mockDisciplineNames);
    });

    // not sure how to test delete
    // it('should delete project', () => {
    //   expect($location.url()).toEqual(`/projects/${ctrl.projectId}`);
    //   ctrl.deleteProject();
    //   $httpBackend.expectDELETE(`${url}/projects/${ctrl.projectId}`).respond({ status: 204 });
    //   $httpBackend.flush();
    //   expect($location.url()).toEqual('/projects');
    // });
  });
});
