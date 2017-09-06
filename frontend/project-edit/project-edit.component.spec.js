describe('projectEdit', () => {
  beforeEach(module('projectEdit'));

  describe('ProjectEditController', () => {
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
    };
    const EMPTY_FORM = {
      peopleObjects: [],
      peopleStrings: [],
      campusCheckboxes: [],
      categoryCheckboxes: [],
      disciplineCheckboxes: [],
      imageData: null,
    };
    const mockProject = {
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
    };
    const mockProjectEdited = {
      title: 'Mock Project',
      description: 'Mock description.',
      url: 'http://mock.url',
      year: '9999',
      image_ref: null,
      campus_ids: [1, 3],
      category_ids: [2, 3],
      discipline_ids: [1, 2],
      tags: ['tag1', 'tag2'],
      people: 'fName1--lName1;fName2--lName2;fName3--lName3',
    };
    const mockForm = {
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
      peopleStrings: [],
      campusCheckboxes: [
        { id: 1, name: 'IU Bloomington', selected: true },
        { id: 2, name: 'IU East' },
        { id: 3, name: 'IU Kokomo', selected: true },
      ],
      categoryCheckboxes: [
        { id: 1, name: 'Virtual Reality' },
        { id: 2, name: 'Augmented Reality', selected: true },
        { id: 3, name: '3D Digitization', selected: true },
      ],
      disciplineCheckboxes: [
        { id: 1, name: 'Science and Mathematics', selected: true },
        { id: 2, name: 'Engineering and Technology', selected: true },
        { id: 3, name: 'Informatics and Computing' },
      ],
      imageData: null,
    };
    const mockFormEdited = {
      peopleObjects: [
        {
          name_first: 'fName1',
          name_last: 'lName1',
        },
        {
          name_first: 'fName2',
          name_last: 'lName2',
        },
        {
          name_first: 'fName3',
          name_last: 'lName3',
        },
      ],
      peopleStrings: [],
      campusCheckboxes: [
        { id: 1, name: 'IU Bloomington' },
        { id: 2, name: 'IU East' },
        { id: 3, name: 'IU Kokomo', selected: true },
      ],
      categoryCheckboxes: [
        { id: 1, name: 'Virtual Reality' },
        { id: 2, name: 'Augmented Reality', selected: true },
        { id: 3, name: '3D Digitization', selected: true },
      ],
      disciplineCheckboxes: [
        { id: 1, name: 'Science and Mathematics', selected: true },
        { id: 2, name: 'Engineering and Technology', selected: true },
        { id: 3, name: 'Informatics and Computing' },
      ],
      imageData: null,
    };

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(($componentController, _$httpBackend_, $routeParams) => {
      $httpBackend = _$httpBackend_;
      $routeParams.projectId = '000';
      ctrl = $componentController('projectEdit');
    }));

    it('should get project id from routeParams', () => {
      expect(ctrl.projectId).toBeDefined();
      expect(ctrl.projectId).toBe('000');
    });

    it('should initiate project and form', () => {
      expect(ctrl.project).toEqual(EMPTY_PROJECT);
      expect(ctrl.form).toEqual(EMPTY_FORM);
    });

    //Not using reset currently 

    // it('should reset the form', () => {
    //   ctrl.project = mockProjectEdited;
    //   $httpBackend.expectGET(`${url}/project/${ctrl.projectId}`).respond(mockProject);
    //   $httpBackend.expectGET(`${url}/campuses`).respond(mockCampuses);
    //   $httpBackend.expectGET(`${url}/categories`).respond(mockCategories);
    //   $httpBackend.expectGET(`${url}/disciplines`).respond(mockDisciplines);
    //   $httpBackend.flush();
    //   ctrl.resetForm();
    //   expect(ctrl.project).toEqual(mockProject);
    //   expect(ctrl.form).toEqual(mockForm);
    // });

    it('should submit the form', () => {
      ctrl.project = mockProject;
      ctrl.form = mockFormEdited;
      ctrl.submitForm();
      expect(ctrl.project).toEqual(mockProjectEdited);
      // $httpBackend.expectPUT(`${url}/project/${ctrl.projectId/edit}`, ctrl.project);
    });
  });
});
