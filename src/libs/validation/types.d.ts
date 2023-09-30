export type ValidationRule = {
  $validator: Function;
  $message: string;
};
export type ValidationItem = {
  $errors: string[];
  $invalid: boolean;
  $rules: ValidationRule[];
  $touch: Function;
};

export type ValidationObject = { [key: string]: ValidationItem };

export interface IValidation {
  $touch: Function;
  $reset: Function;
  $invalid: boolean;
  $rules: { [key: string]: ValidationRule[] };
  $data: { [key: string]: any };
  $validation: ValidationObject;
}
