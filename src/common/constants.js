export const PASSWORD_COMPLEXITY = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/;
export const PHONE_FORMAT = /^\d+$/;
export const NAME_FORMAT = /^[a-zA-Z]+$/;
export const PHONE_DIGITS = 10;
export const MIN_PASSWORD_LEN = 8;
export const MAX_PASSWORD_LEN = 30;
export const MIN_FIRST_NAME_LEN = 1;
export const MAX_FIRST_NAME_LEN = 30;
export const MIN_LAST_NAME_LEN = 1;
export const MAX_LAST_NAME_LEN = 30;
export const MIN_USERNAME_LEN = 1;
export const MAX_USERNAME_LEN = 15;
export const MIN_TITLE_LEN = 4;
export const MAX_TITLE_LEN = 40;
export const MIN_DESCRIPTION_LEN = 8;
export const MAX_DESCRIPTION_LEN = 8192;


export const USERNAME_LEN_ERROR = `Username must be between ${MIN_USERNAME_LEN} and ${MAX_USERNAME_LEN} symbols.`;
export const USERNAME_TAKEN_ERROR = 'This username is already taken.';
export const FIRST_NAME_LETTERS_ERROR = 'First name must contain only letters.';
export const LAST_NAME_LETTERS_ERROR = 'Last name must contain only letters.';
export const FIRST_NAME_ERROR = `First Name must be between ${MIN_FIRST_NAME_LEN} and ${MAX_FIRST_NAME_LEN} symbols.`;
export const LAST_NAME_ERROR = `Last Name must be between ${MIN_LAST_NAME_LEN} and ${MAX_LAST_NAME_LEN} symbols.`;
export const PHONE_FORMAT_ERROR = `The phone number must contain digits only and it's length must be ${PHONE_DIGITS}.`;
export const PHONE_TAKEN_ERROR = 'A user is registered with this phone number.';
export const PASSWORD_MATCH_ERROR = 'The passwords do not match. Please make sure you repeat your password correctly.';
export const PASSWORD_COMPLEXITY_ERROR = `Password must contain at least one uppercase letter,
one lowercase letter, one digit, and one special character.`;
export const PASSWORD_LEN_ERROR = `Password must be between ${MIN_PASSWORD_LEN} and ${MAX_PASSWORD_LEN} symbols.`;
export const EMAIL_USED_ERROR = 'This email address is already used.';
export const AVATAR_ERROR = 'Please select a JPEG under 1MB.';
export const TITLE_ERROR = `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters.`;
export const DESCRIPTION_ERROR = `Content must be between ${MIN_DESCRIPTION_LEN} and ${MAX_DESCRIPTION_LEN} characters.`;
export const START_DATE_REQUIRED_ERROR = 'Start date is required.';
export const END_DATE_REQUIRED_ERROR = 'End date is required.';
export const START_DATE_PERIOD_ERROR = 'Start date must be in the future.';
export const END_DATE_PERIOD_ERROR = 'End date must be after start date.';

export const validateSignUp = (formData) => {
  const validationErrors = {};

  if (formData.userName.length < MIN_USERNAME_LEN || formData.userName.length > MAX_USERNAME_LEN) {
    validationErrors.userName = USERNAME_LEN_ERROR;
  }

  if (formData.firstName.length < MIN_FIRST_NAME_LEN || formData.firstName.length > MAX_FIRST_NAME_LEN) {
    validationErrors.firstName = FIRST_NAME_ERROR;
  }

  if (formData.lastName.length < MIN_LAST_NAME_LEN || formData.lastName.length > MAX_LAST_NAME_LEN) {
    validationErrors.lastName = LAST_NAME_ERROR;
  }

  if (!NAME_FORMAT.test(formData.firstName)) {
    validationErrors.firstName = FIRST_NAME_LETTERS_ERROR;
  }

  if (!NAME_FORMAT.test(formData.lastName)) {
    validationErrors.lastName = LAST_NAME_LETTERS_ERROR;
  }

  if (!PHONE_FORMAT.test(formData.phoneNumber) || formData.phoneNumber.length !== PHONE_DIGITS) {
    validationErrors.phoneNumber = PHONE_FORMAT_ERROR;
  }

  if (formData.password.length < MIN_PASSWORD_LEN || formData.password.length > MAX_PASSWORD_LEN) {
    validationErrors.password = PASSWORD_LEN_ERROR;
  }

  if (!PASSWORD_COMPLEXITY.test(formData.password)) {
    validationErrors.password = PASSWORD_COMPLEXITY_ERROR;
  }

  if (formData.password !== formData.passwordRepeat) {
    validationErrors.password = PASSWORD_MATCH_ERROR;
  }

  if (Object.keys(validationErrors).length === 0) {
    return false;
  }

  return validationErrors;
};

export const validateEditProfile = (formData) => {
  const validationErrors = {};

  if (formData.firstName !== '') {
    if (formData.firstName.length < MIN_FIRST_NAME_LEN || formData.firstName.length > MAX_FIRST_NAME_LEN) {
      validationErrors.firstName = FIRST_NAME_ERROR;
    }

    if (!NAME_FORMAT.test(formData.firstName)) {
      validationErrors.firstName = FIRST_NAME_LETTERS_ERROR;
    }
  }

  if (formData.lastName !=='') {
    if (formData.lastName.length < MIN_LAST_NAME_LEN || formData.lastName.length > MAX_LAST_NAME_LEN) {
      validationErrors.lastName = LAST_NAME_ERROR;
    }

    if (!NAME_FORMAT.test(formData.lastName)) {
      validationErrors.lastName = LAST_NAME_LETTERS_ERROR;
    }
  }

  if (formData.phoneNumber !=='') {
    if (!PHONE_FORMAT.test(formData.phoneNumber) || formData.phoneNumber.length !== PHONE_DIGITS) {
      validationErrors.phoneNumber = PHONE_FORMAT_ERROR;
    }
  }

  if (formData.password !=='' || formData.passwordRepeat !=='') {
    if (!PASSWORD_COMPLEXITY.test(formData.password)) {
      validationErrors.password = PASSWORD_COMPLEXITY_ERROR;
    }

    if (formData.password.length < MIN_PASSWORD_LEN || formData.password.length > MAX_PASSWORD_LEN) {
      validationErrors.password = PASSWORD_LEN_ERROR;
    }

    if (formData.password !== formData.passwordRepeat) {
      validationErrors.password = PASSWORD_MATCH_ERROR;
    }
  }

  if (Object.keys(validationErrors).length === 0) {
    return false;
  }

  return validationErrors;
};

export const validateAvatar = (avatar) => {
  const validationErrors = {};

  if (avatar.type !== 'image/jpeg' || avatar.size > 1024 * 1024) {
    validationErrors.avatar = AVATAR_ERROR;
    return validationErrors;
  } else {
    return false;
  }
};

export const validateEvent = (title, description, startDate, endDate) => {
  const formErrors = {};

  if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN) {
    formErrors.title = TITLE_ERROR;
  }

  if (
    description.length < MIN_DESCRIPTION_LEN ||
    description.length > MAX_DESCRIPTION_LEN
  ) {
    formErrors.description = DESCRIPTION_ERROR;
  }

  if (!startDate) {
    formErrors.startDate = START_DATE_REQUIRED_ERROR;
  }

  if (!endDate) {
    formErrors.endDate = END_DATE_REQUIRED_ERROR;
  }

  if (startDate && endDate && startDate > endDate) {
    formErrors.endDate = END_DATE_PERIOD_ERROR;
  }

  if (startDate && startDate < new Date()) {
    formErrors.startDate = START_DATE_PERIOD_ERROR;
  }

  if (Object.keys(formErrors).length === 0) {
    return false;
  }

  return formErrors;
};

export const validateTitle = (title) => {
  if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN) {
    return TITLE_ERROR;
  }

  return false;
};

export const validateDescription = (description) => {
  if (
    description.length < MIN_DESCRIPTION_LEN ||
    description.length > MAX_DESCRIPTION_LEN
  ) {
    return DESCRIPTION_ERROR;
  }

  return false;
};

