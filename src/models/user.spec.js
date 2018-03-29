const assert = require('assert');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
require('mongoose').connect(
  'mongodb://test:123456@ds127129.mlab.com:27129/auth-test'
);
require('../models/user');

const User = mongoose.model('user');

describe('User', function() {
  const newUser = {
    id: null,
    email: `${uuidv4()}@doe.com`,
    password: uuidv4()
  };

  it('Should insert a user', function(done) {
    setTimeout(done, 3000);
    User(newUser).save(function(err, user) {
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
