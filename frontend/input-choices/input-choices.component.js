angular
  .module('inputChoices')
  .component('inputChoices', {
    templateUrl: 'input-choices/input-choices.template.html',
    bindings: {
      tagsArray: '<',
      onUpdate: '&',
    },
    controller: function InputChoicesController() {
      this.tagsChoices = new Choices(document.getElementById('choices-text-remove-button'), {
        delimiter: ',',
        editItems: true,
        maxItemCount: 5,
        removeItemButton: true,
        placeholderValue: 'Enter tags',
        duplicateItems: false,
      });

      this.$onInit = () => {
        this.tagsChoices.setValue(this.tagsArray);
      };

      // tagsArray may not be ready when the component initializes
      // so update values when they arrive
      // also, must clear values before setting new ones
      this.$onChanges = (changesObj) => {
        this.tagsChoices.clearStore();
        this.tagsChoices.setValue(changesObj.tagsArray.currentValue);
      };

      this.$postLink = () => {
        this.tagsChoices.passedElement.addEventListener('change', () => {
          this.onUpdate({ tagsArray: this.tagsChoices.getValue(true) });
        });
      };
    },
  });
