import {
  assertDownloadedXmlContainsExpected,
  getCrownButtonForElement,
  uploadXml,
  waitToRenderAllShapes,
} from '../support/utils';

describe('Pools', () => {
  it('Case 1 Delete a Pool should remove all elements inside it', () => {
    uploadXml('TwoPools.xml');
    waitToRenderAllShapes();
    cy.get('g[data-type="processmaker.modeler.bpmn.pool"]:visible').eq(1)
      .click({ force: true })
      .then($pool => {
        getCrownButtonForElement($pool, 'delete-button').click({ force: true });
      });
    cy.fixture('TwoPools.after.xml', 'base64').then(data => {
      assertDownloadedXmlContainsExpected(atob(data));
    });
  });
});
