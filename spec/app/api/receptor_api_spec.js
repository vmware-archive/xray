require('../spec_helper');

describe('ReceptorApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Promise, subject;
  beforeEach(function() {
    Promise = require('../../../lib/promise');
    require('../../../app/api/base_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/receptor_api');
  });

  describe('#fetch', function() {
    var doneSpy, actualLrpsPromise, cellsPromise, desiredLrpsPromise, receptorPromise;
    beforeEach(function() {
      actualLrpsPromise = Deferred();
      cellsPromise = Deferred();
      desiredLrpsPromise = Deferred();

      spyOn(require('../../../app/api/actual_lrps_api'), 'fetch').and.returnValue(actualLrpsPromise);
      spyOn(require('../../../app/api/cells_api'), 'fetch').and.returnValue(cellsPromise);
      spyOn(require('../../../app/api/desired_lrps_api'), 'fetch').and.returnValue(desiredLrpsPromise);
      doneSpy = jasmine.createSpy('done');
      receptorPromise = subject.fetch();
      receptorPromise.then(doneSpy);
    });

    describe('when the ajax calls have returned', function() {
      var actualLrps, cells, desiredLrps;
      beforeEach(function() {
        actualLrps = Factory.buildList('actualLrp', 2);
        cells = Factory.buildList('cell', 2);
        desiredLrps = Factory.buildList('desiredLrp', 3);

        actualLrpsPromise.resolve({actualLrps});
        cellsPromise.resolve({cells});
        desiredLrpsPromise.resolve({desiredLrps});
        mockPromises.executeForResolvedPromises();
        mockPromises.executeForPromise(receptorPromise);
      });

      it('resolves the promise with cells and desired lrps', function() {
        expect(doneSpy).toHaveBeenCalledWith({actualLrps, cells, desiredLrps});
      });
    });
  });
});

