const chai = require('chai')
const chaiHttp = require('chai-http')
const {app} = require('../app')

chai.should()
chai.use(chaiHttp)

token = ''

chai
	.request(app)
	.post('/v1/auth/login/')
	.send({
		"login": "pedro",
		"password": "tequila"
	})
	.end((err, res) => {
		token = res.body.access_token
	})

alertID = ''

// A serie of test lauch with a VALID access token
describe('AUTHORIZED users tests', () => {

	it('should create a new alert', done => {
		chai
			.request(app)
			.post('/v1/alerts/')
			.set('Authorization', 'bearer ' + token)
			.send({
				"type": "weather",
				"label": "My alert for",
				"status": "warning",
				"from": "string",
				"to": "string"
			})
			.end((err, res) => {
				alertID = res.body._id
				assert(alertID !== '', 'alertID = ' + alertID)
				
				res
					.should
					.have
					.status(200)
				res.should.be.json
				res
					.body
					.should
					.be
					.a('object')
				res
					.body
					.should
					.have
					.property('_id')
				res
					.body
					.should
					.have
					.property('type')
				res
					.body
					.type
					.should
					.equal('weather')
				res
					.body
					.should
					.have
					.property('label')
				res
					.body
					.type
					.should
					.equal('My alert for')
				res
					.body
					.should
					.have
					.property('status')
				res
					.body
					.type
					.should
					.equal('warning')
				res
					.body
					.should
					.have
					.property('from')
				res
					.body
					.should
					.have
					.property('to')
				done()
			})
	})

	it('should not add an alert because of wrong parameter', done => {
    chai
      .request(app)
      .post('/v1/alerts')
      .set('Authorization', 'bearer ' + token)
      .send({
				type: "weather",
				label: "My alert for",
				status: "warning",
				from: "string",
				to: "string",
				wrongparam: "value"
			})
      .end((err, res) => {
        res
          .should
          .have
          .status(405)
        res.should.be.json
				done()
			})
	})

	it('should get a array of alert', done => {
		chai
			.request(app)
			.get('/v1/alerts/search?status=danger,risk')
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
					.should
					.have
					.status(200)
				res.should.be.json
				res
          .body
          .should
          .be
					.a('array')
				done()
			})
	})

	it('should give error because of bad search', done => {
		chai
			.request(app)
			.get('/v1/alerts/search?status=badTag')
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
					.should
					.have
					.status(400)
				res.should.be.json
				res
					.body
					.should
					.be
					.a('object')
				done()
			})
	})

	it('should list a single alert corresponding to id', done => {
		chai
			.request(app)
			.get('/v1/alerts/' + alertID)
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('_id')
        res
          .body
          .id
          .should
          .equal(alertID)
        done()
			})
	})

	it('should return an error because of bad id', done => {
		chai
			.request(app)
			.get('/v1/alerts/invalidID')
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
          .should
          .have
          .status(400)
				res.should.be.json
				res
          .body
          .should
          .be
					.a('object')
				done()
			})
	})

	it('should return an error because no alert was find', done => {
		chai
			.request(app)
			.get('/v1/alerts/5cd03052bfee6a258c439d60')
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
          .should
          .have
          .status(404)
				res.should.be.json
				res
          .body
          .should
          .be
					.a('object')
				done()
			})
	})

	it('should replace old alert by new one', done => {
		chai
			.request(app)
			.put('/v1/alerts/' + alertID)
			.set('Authorization', 'bearer ' + token)
			.send({
				"type": "weather",
				"label": "My new alert for",
				"status": "warning",
				"from": "string",
				"to": "string"
			})
			.end((err, res) => {
				res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('_id')
        res
          .body
          .id
          .should
          .equal(alertID)
        done()
			})
	})

	it('should return an error because of invalid new object', done => {
		chai
			.request(app)
			.put('/v1/alerts/' + alertID)
			.set('Authorization', 'bearer ' + token)
			.send({
				"badParam": "value"
			})
			.end((err, res) => {
				res
          .should
          .have
          .status(405)
        done()
			})
	})

	it('should return error because bad id', done => {
		chai
			.request(app)
			.delete('/v1/alerts/invalidID')
			.set('Authorization', 'bearer ' + token)
			.end((err, res) => {
				res
					.should
					.have
					.status(400)
				done()
			})
	})

	it('should return error because alert was not found', done => {
		chai
		.request(app)
		.delete('/v1/alerts/5cd03052bfee6a258c439d60')
		.set('Authorization', 'bearer ' + token)
		.end((err, res) => {
			res
				.should
				.have
				.status(404)
			done()
		})
	})

})


// A serie of test lauch with an INVALID or UNDEFINED access token
/*describe('UNAUTHORIZED users tests', () => {

})*/
