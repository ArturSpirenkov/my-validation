import 'normalize.css';
import { Validation, validationRules } from './libs/validation/validation';
const log = console.log;

const formData = {
  input: '',
};

const vRules = {
  input: [
    validationRules.required,
    validationRules.notOnlyNumbers,
    validationRules.lengthBoundary(3, 20),
  ],
};

const $v = new Validation(formData, vRules);

const input = document.querySelector('.form__main input');
const errorInput = document.querySelector('.form__main span');

input?.addEventListener('input', (event: Event) => {
  const target = (event.target as HTMLInputElement).value;
  formData.input = target;
});

input?.addEventListener('blur', () => {
  $v.$validation.input.$touch();
  if ($v.$validation.input.$errors[0] === undefined) {
    errorInput!.textContent = '';
    return;
  }
  errorInput!.textContent = `${$v.$validation.input.$errors[0]}`;
});
