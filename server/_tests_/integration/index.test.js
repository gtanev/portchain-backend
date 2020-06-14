import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

const { request, expect } = chai;

describe('GET /', () => {
  it('should return a list of registered endpoints', done => {
    request(app)
      .get('/')
      .end((error, response) => {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.ownProperty('endpoints');
        expect(response.body.endpoints).to.be.an('array').that.is.not.empty;
        done();
      });
  });
});
