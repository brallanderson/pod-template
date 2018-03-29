const assert = require('assert');
const expect = require('chai').expect;
const mongoose = require('mongoose');
require('mongoose').connect(
  'mongodb://test:123456@ds127129.mlab.com:27129/auth-test'
);
require('../models/user');

const User = mongoose.model('user');

describe('User', function() {
  const newUser = {
    id: null,
    email: 'john@doe.com',
    password: '123456'
  };

  it('Should insert a user', function(done) {
    User(newUser).save((err, user) => {
      expect(user).to.not.be.null;
      expect(user.email).to.be.equal(newUser.email);
      expect(user.password).to.not.be.null;
      newUser.id = user._id;
      console.log(newUser.id);

      err ? done(err) : done();
    });
  });

  it('Should delete a user', function(done) {
    User.findByIdAndRemove(newUser.id, function(err) {
      err ? done(err) : done();
    });
  });
});
