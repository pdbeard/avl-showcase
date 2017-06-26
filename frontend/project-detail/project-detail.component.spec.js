describe('projectDetail', () => {
  beforeEach(module('projectDetail'));

  describe('ProjectDetailController', () => {
    let $httpBackend;
    let ctrl;
    const url = 'http://localhost:8080';
    const mockProject = { campus_ids: [7, 1], category_ids: [8], discipline_ids: [15], tags: ['definition', 'Versatile'], id: 'fe4cb1d025bd7c4bbd7845ffd36a2f2045b246f5', title: 'Tin', description: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', year: 2010, url: 'http://reuters.com/accumsan/odio/curabitur/convallis.html', people: 'Victor--Gomez' };

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(($componentController, _$httpBackend_, $routeParams) => {
      $httpBackend = _$httpBackend_;
      $routeParams.projectId = '000';
      ctrl = $componentController('projectDetail');
    }));

    it('should get project id from routeParams', () => {
      expect(ctrl.projectId).toBeDefined();
      expect(ctrl.projectId).toBe('000');
    });

    it('should get project', () => {
      expect(ctrl.project).toEqual({});
      $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
      ctrl.getProject();
      $httpBackend.flush();
      expect(ctrl.project).toEqual(mockProject);
    });
  });
});
