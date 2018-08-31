process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');

const User = require('../models/user');

let token = '';

chai.use(chaiHttp);

describe('Users', () => {
  describe('/POST api/v1/users/login', () => {
    it('it should FAIL to authenticate with incorrect username / password', done => {
      chai
        .request(app)
        .post('/api/v1/users/login')
        .send({ user: { email: 'test@test.com', password: 'fsaddfsadfsadf' } })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');

          done();
        });
    });
  });
  describe('/POST api/v1/users/login', () => {
    it('it should successfully login', done => {
      chai
        .request(app)
        .post('/api/v1/users/login')
        .send({ user: { email: 'test@test.com', password: 'password' } })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');

          token = res.body.user.token;

          done();
        });
    });
  });

  describe('/GET api/v1/user', () => {
    it('it should return the currently logged in user with an updated token', done => {
      chai
        .request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');

          done();
        });
    });
  });

  describe('/GET api/v1/users', () => {
    it('it should GET the list of users', done => {
      chai
        .request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('users');
          res.body.users.should.be.a('array');

          done();
        });
    });
  });
});
