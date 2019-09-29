import StringUtil from 'core/services/StringUtil';

class Validation {
  constructor(props) {
    this.props = props;
    this.validated = false;
  }

  updateValidated(prop) {
    if (this.validated) {
      return;
    }
    this.validated = prop ? false : true;
  }

  isValid(model, prop) {
    this.updateValidated(prop);

    // don't validate individual props
    // until the model has been asked to validate by the form
    if (!this.validated && prop) {
      return true;
    }
    if (prop && this.props[prop]) {
      return this.validateProp(model, prop);
    } else if (!prop) {
      return this.props.reduce((valid, prop) => {
        valid = valid && this.validateProp(model, prop);
      }, true);
    } else {
      return true;
    }
  }

  validateProp(model, prop) {
    let value = model[prop],
      valid = true;

    if (!value) {
      this[prop] = StringUtil.capitalize(prop) + ' is required';
      valid = false;
    } else if (this[prop]) {
      delete this[prop];
    }

    return valid;
  }
}
