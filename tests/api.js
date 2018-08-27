process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('API', () => {
  beforeEach(done => {
    done();
  });

  describe('/GET api', () => {
    it('it should GET a response with status code 200', done => {
      chai
        .request(app)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
