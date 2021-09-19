const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля: не валидно, длина строки меньше min (value.length < min)', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      // name length 6 characters
      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет строковые поля: не валидно, длина строки больше max (value.length > max)', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });
      // name length 21 characters
      const errors = validator.validate({ name: 'LalalLalalLalalLalalQ' });

      console.log('ERRORS: ', errors);

      expect(errors).to.have.length(1); 
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 21');
    });
    it('валидатор проверяет строковые поля: валидные значения длина строго между min < value < max', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      // name length 6 characters
      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет строковые поля: валидные значения длина равна min', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      // name length 5 characters
      const errors = validator.validate({ name: 'Lalal' });
      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет строковые поля: валидные значения длина равна max', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
      });

      // name length 20 characters
      const errors = validator.validate({ name: 'LalalLalalLalalLalal' });
      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет числовые поля: не валидное, значение меньше min (value < min)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 9 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');
    });
    it('валидатор проверяет числовые поля: валидное, значение равно min (value === min)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 10 });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет числовые поля: валидное, значение между min (min < value < max)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 11 });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет числовые поля: валидное, значение равно max (value === max)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 20 });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет числовые поля: не валидное, значение больше max (value > max)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 21});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');
    });

    it('два поля, оба не валидны', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 21, name: 'a'});

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too short, expect 10, got 1');
    });

    it('два поля, оба валидны', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 19, name: 'abcabcabcabc'});

      expect(errors).to.have.length(0);
    });

    it('все поля должны быть переданы как аргумент (no string)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 10});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got undefined');
    });

    it('все поля должны быть переданы как аргумент (no number)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'string'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
    });
  });
});