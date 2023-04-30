export class EmptyFieldError extends Error {
  constructor(message, property) {
    super(message);
    this.name = 'EmptyFieldError';
    this.property = property;
  }
}

export class InvalidEmailError extends Error {
	constructor(message, property) {
		super(message);
		this.property = property;
		this.name = 'InvalidEmailError';
	}
}
