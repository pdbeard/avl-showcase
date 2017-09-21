describe('projectCreate', () => {
  beforeEach(module('projectCreate'));

  describe('ProjectCreateController', () => {
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
    const EMPTY_PROJECT = {
      title: '',
      description: '',
      url: '',
      year: '',
      image_ref: null,
      campus_ids: [],
      category_ids: [],
      discipline_ids: [],
      tags: [],
      people: '',
      create: '',
    };
    const EMPTY_FORM = {
      peopleObjects: [],
      peopleStrings: [],
      campusCheckboxes: [],
      categoryCheckboxes: [],
      disciplineCheckboxes: [],
      imageData: null,
    };
    const mockProjectPreSubmit = {
      title: 'Mock Project',
      description: 'Mock description.',
      url: 'http://mock.url',
      year: '9999',
      image_ref: null,
      campus_ids: [1, 3],
      category_ids: [2, 3],
      discipline_ids: [1, 2],
      tags: ['tag1', 'tag2'],
      people: '',
      create_time: '',
    };
    const mockProjectPostSubmit = {
      title: 'Mock Project',
      description: 'Mock description.',
      url: 'http://mock.url',
      year: '9999',
      image_ref: null,
      campus_ids: [1, 3],
      category_ids: [2, 3],
      discipline_ids: [1, 2],
      tags: ['tag1', 'tag2'],
      people: 'fName1--lName1;fName2--lName2',
      create_time: 'date and time',
    };
    const mockForm = {
      tagsString: 'tag1, tag2',
      peopleObjects: [
        {
          name_first: 'fName1',
          name_last: 'lName1',
        },
        {
          name_first: 'fName2',
          name_last: 'lName2',
        },
      ],
      peopleStrings: ['fName1--lName1', 'fName2--fName2'],
      campusCheckboxes: [
        { id: 1, name: 'IU Bloomington', checked: 'checked' },
        { id: 2, name: 'IU East' },
        { id: 3, name: 'IU Kokomo', checked: 'checked' },
      ],
      categoryCheckboxes: [
        { id: 1, name: 'Virtual Reality' },
        { id: 2, name: 'Augmented Reality', checked: 'checked' },
        { id: 3, name: '3D Digitization', checked: 'checked' },
      ],
      disciplineCheckboxes: [
        { id: 1, name: 'Science and Mathematics', checked: 'checked' },
        { id: 2, name: 'Engineering and Technology', checked: 'checked' },
        { id: 3, name: 'Informatics and Computing' },
      ],
      imageData: null,
    };

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(($componentController, _$httpBackend_, $routeParams) => {
      $httpBackend = _$httpBackend_;
      $routeParams.projectId='000';
      ctrl = $componentController('projectCreate_time');
    }));

    it('should get project id from routeParams', () => {
      expect(ctrl.projectId).toBeDefined();
      expect(ctrl.projectId).toBe('000');
    });

    it('should initiate project and form', () => {
      // console.log(ctrl);
      expect(ctrl.project).toEqual(EMPTY_PROJECT);
      expect(ctrl.form).toEqual(EMPTY_FORM);
    });

    it('should get campuses', () => {
      expect(ctrl.form.campusCheckboxes).toEqual([]);
      $httpBackend.expectGET(`${url}/campuses`).respond(mockCampuses);
      $httpBackend.flush();
      expect(ctrl.form.campusCheckboxes).toEqual(mockCampuses);
    });

    it('should get categories', () => {
      expect(ctrl.form.categoryCheckboxes).toEqual([]);
      $httpBackend.expectGET(`${url}/categories`).respond(mockCategories);
      $httpBackend.flush();
      expect(ctrl.form.categoryCheckboxes).toEqual(mockCategories);
    });

    it('should get disciplines', () => {
      expect(ctrl.form.disciplineCheckboxes).toEqual([]);
      $httpBackend.expectGET(`${url}/disciplines`).respond(mockDisciplines);
      $httpBackend.flush();
      expect(ctrl.form.disciplineCheckboxes).toEqual(mockDisciplines);
    });

// Reset form is still bugged. App now reloads page to reset state. 

    // it('should reset the form', () => {
    //   ctrl.project = mockProjectPreSubmit;
    //   $httpBackend.expectGET(`${url}/campuses`).respond(mockCampuses);
    //   $httpBackend.expectGET(`${url}/categories`).respond(mockCategories);
    //   $httpBackend.expectGET(`${url}/disciplines`).respond(mockDisciplines);
    //   $httpBackend.flush();
    //   ctrl.resetForm();
    //   expect(ctrl.project).toEqual(EMPTY_PROJECT);
    //   expect(ctrl.form.campusCheckboxes).toEqual(mockCampuses);
    //   expect(ctrl.form.categoryCheckboxes).toEqual(mockCategories);
    //   expect(ctrl.form.disciplineCheckboxes).toEqual(mockDisciplines);
    // });

    it('should submit the form', () => {
      ctrl.project = mockProjectPreSubmit;
      ctrl.form = mockForm;
      ctrl.submitForm();
      expect(ctrl.project).toEqual(mockProjectPostSubmit);
      // $httpBackend.expectPOST(`${url}/projects`, ctrl.project);
    });
  });
});
