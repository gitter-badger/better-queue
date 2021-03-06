var assert = require('assert');
var Ticket = require('../lib/ticket');

describe('Ticket', function() {
  var t;

  before(function () {
    t = new Ticket();
  })

  it('should instantiate', function () {
    assert.ok(t);
  })

  it('should accept', function () {
    assert.ok(!t.isAccepted, 'ticket is not accepted');
    t.accept();
    assert.ok(t.isAccepted, 'ticket is accepted');
  })

  it('should queue', function () {
    assert.ok(!t.isQueued, 'ticket is not queued');
    t.queued();
    assert.ok(t.isQueued, 'ticket is queued');
  })

  it('should start and stop', function () {
    assert.ok(!t.isStarted, 'ticket is not started');
    t.started();
    assert.ok(t.isStarted, 'ticket is started');
    t.stopped();
    assert.ok(!t.isStarted, 'ticket is stopped');
  })

  it('should finish and emit', function (done) {
    assert.ok(!t.isFinished, 'ticket is not finished');
    t.once('done', function (result) {
      assert.deepEqual(result, { x: 1 });
      assert.ok(t.isFinished, 'ticket is finished');
      done();
    })
    t.finish({ x: 1 });
  })

  it('should fail and emit', function (done) {
    assert.ok(!t.isFailed, 'ticket not failed');
    t.once('fail', function (err) {
      assert.equal(err, 'some_error');
      assert.ok(t.isFailed, 'ticket failed');
      done();
    })
    t.failed('some_error');
  })

  it('should progress and emit', function (done) {
    t.started(2);
    t.once('progress', function (progress) {
      assert.equal(progress.pct, 50);
      assert.equal(progress.current, 1);
      assert.equal(typeof progress.eta, 'string');
      t.once('progress', function (progress) {
        assert.equal(progress.pct, 100);
        assert.equal(progress.current, 2);
        assert.equal(progress.total, 2);
        done();
      });
      t.progress(2);
    });
    t.progress(1);
  })
  
  
})
