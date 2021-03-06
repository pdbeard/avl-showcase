angular
  .module('selectMultiple')
  .component('selectMultiple', {
    templateUrl: 'select-multiple/select-multiple.template.html',
    bindings: {
      field: '@',
      optionsObjects: '<',
      onUpdate: '&',
    },
    controller: function SelectMultipleController() {
      this.$onInit = () => {
        this.selectChoices = null;
      };

      // field and optionsObjects may not be ready when the component initializes
      // so update values when they arrive
      this.$onChanges = (changesObject) => {
        const choicesExists = document.getElementById(this.field);

        if (choicesExists) {
          this.selectChoices = new Choices(`#${this.field}`, {
            removeItemButton: true,
            shouldSort: false,
          });

          this.selectChoices.passedElement.addEventListener('change', () => {
            this.onUpdate({ field: this.field, selected: this.selectChoices.getValue(true) });
          });
        }

        if (this.selectChoices && changesObject.optionsObjects.currentValue) {
          this.selectChoices.clearStore();
          this.selectChoices.setChoices(changesObject.optionsObjects.currentValue, 'id', 'name', true);
        }
      };

      this.$postLink = () => {
      };
    },
  });
