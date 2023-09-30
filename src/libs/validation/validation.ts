import { type ValidationRule, IValidation, ValidationObject } from './types';

// TODO: this should have ierarch in $validation

export class Validation implements IValidation {
  $invalid: boolean = false;
  $rules: { [key: string]: ValidationRule[] };
  $data: { [key: string]: any };
  $validation: ValidationObject = {};

  // Data keys should be equal rules keys
  constructor(
    data: { [key: string]: any },
    rules: { [key: string]: ValidationRule[] }
  ) {
    this.$rules = rules;
    this.$data = data;
    Object.entries(data).forEach(([key, _]: [key: string, value: any]) => {
      const self = this;
      this.$validation[key] = {
        $errors: [],
        $invalid: false,
        $rules: rules[key],
        $touch: () => self.__touchValidation(key),
      };
    });
  }

  __touchValidation(validationField: string) {
    // console.log(validationField);
    const errors: string[] = [];
    let invalid: boolean = false;
    const validation = this.$validation[validationField];
    Object.entries(validation.$rules).forEach(
      ([key, rule]: [key: string, rule: ValidationRule]) => {
        const isRuleValid = rule.$validator(this.$data[validationField]);
        invalid = invalid || !isRuleValid;
        if (!isRuleValid) {
          errors.push(rule.$message);
          validation.$errors.push(rule.$message);
        }
      }
    );
    this.$validation[validationField].$errors = errors;
    this.$validation[validationField].$invalid = invalid;
    // console.log(this, this.$invalid, invalid);
  }

  $touch() {
    let invalid: boolean = false;
    Object.entries(this.$rules).forEach(
      ([key, rules]: [key: string, rules: ValidationRule[]]) => {
        const validation = this.$validation[key];
        const errors: string[] = [];

        rules.forEach((rule: ValidationRule | Function) => {
          const realRule: ValidationRule =
            typeof rule === 'function' ? rule() : rule;
          const isRuleValid = realRule.$validator(this.$data[key]);
          invalid = invalid || !isRuleValid;

          if (!isRuleValid) {
            errors.push(realRule.$message);
            validation.$errors.push(realRule.$message);
          }
        });

        validation.$errors = errors;
        validation.$invalid = invalid;
      }
    );
    this.$invalid = invalid;
  }

  $reset() {
    this.$invalid = false;
    Object.keys(this.$validation).forEach((key: string) => {
      this.$validation[key].$errors = [];
      this.$validation[key].$invalid = false;
    });
  }
}

export const validationRules: { [key: string]: any } = {
  required: {
    $validator: (value: any) => !!value,
    $message: 'Поле должно быть заполнено',
  },
  lengthBoundary: (low: number, up: number): ValidationRule => {
    return {
      $validator: (value: any) =>
        low <= String(value).length && String(value).length <= up,
      $message: `Длинна значения должна быть от ${low} до ${up} символов`,
    };
  },
  notOnlyNumbers: {
    $validator: (value: string) => isNaN(+value),
    $message: 'Поле не может состоять только из цифр',
  },
  email: {
    $validator: (value: string) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
    $message: 'Адрес электронной почты введен неверно',
  },
  oneLetterUppercased: {
    $validator: (value: string) => /(?=.*[A-Z])/.test(value),
    $message: 'Хотя бы одна буква заглавная',
  },
  isFirstLetterUppercase: {
    $validator: (value: string) => /^[А-ЯЁA-Z]/.test(value),
    $message: 'Первая буква должна быть заглавной',
  },
  doNotUseSpecialСharacters: {
    $validator: (value: string) => /^[А-ЯЁA-Z][а-яёa-z-]*$/.test(value),
    $message: 'Недопустимые спецсимволы',
  },
};
