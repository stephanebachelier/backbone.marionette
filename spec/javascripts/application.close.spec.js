describe('marionette application', function() {
  'use strict';

  describe('when registering an finalizer and stopping the application', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.start();

      this.triggerSpy = this.sinon.spy(this.app, 'trigger');
      this.finalizerStub = this.sinon.stub();
      this.app.addFinalizer(this.finalizerStub);

      this.app.stop();
    });

    it('should notify me before the stops', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:stop');
    });

    it('should notify me after the app has stopped', function() {
      expect(this.triggerSpy).to.have.been.calledWith('stop');
    });

    it('should call the finalizer', function() {
      expect(this.finalizerStub).to.have.been.called;
    });

    it('should pass the options through to the finalizer', function() {
      expect(this.finalizerStub).to.have.been.calledOnce.and.called;
    });

    it('should run the finalizer with the context of the app object', function() {
      expect(this.finalizerStub).to.have.been.calledOn(this.app);
    });
  });

  describe('when an app has been stopped, and registering another finalizer', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.start();

      this.finalizerStub = this.sinon.stub();
      this.app.addFinalizer(this.finalizerStub);
      this.app.stop();
    });

    it('should run the finalizer immediately', function() {
      expect(this.finalizerStub).to.have.been.called;
    });
  });

  describe('when specifying an on stop callback, and stopping the app', function() {
    beforeEach(function() {
      this.app = new Marionette.Application();
      this.app.start();

      this.stopStub = this.sinon.stub();
      this.app.on('stop', this.stopStub);

      this.app.stop();
    });

    it('should run the onstop callback', function() {
      expect(this.stopStub).to.have.been.called;
    });

    it('should pass the stopup option to the callback', function() {
      expect(this.stopStub).to.have.been.calledOnce.and.called;
    });
  });
});
