// utils/validator.js

exports.validateNameQuery = (query) => {
  const { name } = query;

  // Missing
  if (name === undefined) {
    return {
      valid: false,
      status: 400,
      message: 'Name query parameter is required'
    };
  }

  // Type check
  if (typeof name !== 'string') {
    return {
      valid: false,
      status: 422,
      message: 'Name must be a string'
    };
  }

  // Empty or whitespace
  if (name.trim() === '') {
    return {
      valid: false,
      status: 400,
      message: 'Name cannot be empty'
    };
  }

  return {
    valid: true,
    value: name.trim()
  };
};