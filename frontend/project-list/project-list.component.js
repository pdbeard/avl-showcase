angular.module('projectList')
  .component('projectList', {
    templateUrl: 'project-list/project-list.template.html',
    controller: function ProjectListController() {
      this.projects = [
        { id: 0,
          title: 'this is the title',
          description: 'this is the description',
        },
        { id: 1,
          title: 'this is the title',
          description: 'this is the description',
        },
        { id: 2,
          title: 'this is the title',
          description: 'this is the description',
        },
      ];
    },
  });
