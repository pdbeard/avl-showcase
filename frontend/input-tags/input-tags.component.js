angular
  .module('inputTags')
  .component('inputTags', {
    templateUrl: 'input-tags/input-tags.template.html',
    bindings: {
      tagsArray: '<',
      onUpdate: '&',
    },
    controller: function InputTagsController() {
      this.tagsChoices = new Choices(document.getElementById('choices-text-remove-button'), {
        delimiter: ',',
        editItems: true,
        removeItemButton: true,
        placeholderValue: 'Enter tags',
        duplicateItems: false,
      });
      this.$onInit = () => {
        if (this.tagsArray) { this.tagsChoices.setValue(this.tagsArray); }
      };

      // tagsArray may not be ready when the component initializes
      // so update values when they arrive
      // also, must clear values before setting new ones
      this.$onChanges = (changesObj) => {
        if (changesObj.tagsArray.currentValue) {
          // console.log('changes...');
          // console.log(changesObj.tagsArray.currentValue);
          // console.log(this.tagsChoices.getValue(true));
          this.tagsChoices.clearStore();
          // console.log(this.tagsChoices.getValue(true));
          this.tagsChoices.setValue(changesObj.tagsArray.currentValue);
          // console.log(this.tagsChoices.getValue(true));

      // console.log(this.tagsChoices);

        }
      };

      this.$postLink = () => {
        this.tagsChoices.passedElement.addEventListener('change', () => {
          this.onUpdate({ tagsArray: this.tagsChoices.getValue(true) });
        });
      };
    },
  });
