import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

const { request, expect } = chai;

describe('GET /ports', () => {
  it('should return a list of all ports', done => {
    request(app)
      .get('/ports')
      .end((error, response) => {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').with.length(69);
        done();
      });
  }).timeout(5000);

  it('should return a list of all ports with port call duration percentiles', done => {
    request(app)
      .get('/ports?durationPerc=20,50,90')
      .end((error, response) => {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').with.length(69);
        expect(response.body[0]).to.have.nested.property('portCallDurations.hours');
        expect(response.body[0]).to.have.nested.property('portCallDurations.percentiles');
        done();
      });
  }).timeout(5000);

  it('should return the top 5 ports with the least port calls', done => {
    request(app)
      .get('/ports?limit=5&sortKey=portCalls')
      .end((error, response) => {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').with.length(5);
        expect(response.body.map(port => port.name)).to.include.members([
          'Bremerhaven',
          'Karachi',
          'Prince Rupert',
          'Gioia Tauro',
        ]);
        done();
      });
  }).timeout(5000);

  it('should return the top 5 ports with the most port calls', done => {
    request(app)
      .get('/ports?limit=5&sortKey=portCalls&sortDir=desc')
      .end((error, response) => {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').with.length(5);
        expect(response.body.map(port => port.name)).to.include.members([
          'Hamburg',
          'Tokyo',
          'Tanger Med',
        ]);
        done();
      });
  }).timeout(5000);
});
