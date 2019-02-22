import {
  dragFromSourceToDest,
  getElementAtPosition,
  getGraphElements,
  getCrownButtonForElement,
  connectNodesWithFlow,
  getLinksConnectedToElement,
  typeIntoTextInput,
} from '../support/utils';

describe('Undo/redo', () => {
  beforeEach(() => {
    cy.loadModeler();
  });

  it('Can undo and redo adding a task', () => {
    const taskPosition = { x: 300, y: 500 };

    dragFromSourceToDest('processmaker-modeler-task', '.paper-container', taskPosition);

    cy.get('[data-test=undo]').click();

    /* Only the start element should remain */
    getGraphElements().should('have.length', 1);

    cy.get('[data-test=redo]').click();

    /* The task should now be re-added */
    getGraphElements().should('have.length', 2);
  });

  it('Can undo and redo deleting a task', () => {
    const taskPosition = { x: 300, y: 500 };

    dragFromSourceToDest('processmaker-modeler-task', '.paper-container', taskPosition);

    /* Wait for jointjs to render the shape */
    cy.wait(100);

    getElementAtPosition(taskPosition)
      .click()
      .then($task => {
        getCrownButtonForElement($task, 'delete-button').click();
      });

    /* Only the start element should remain */
    getGraphElements().should('have.length', 1);

    cy.get('[data-test=undo]').click();

    /* The task should now be re-added */
    getGraphElements().should('have.length', 2);
  });

  it('Can undo position changes', () => {
    const startEventPosition = { x: 150, y: 150 };
    const startEventMoveToPosition = { x: 300, y: 300 };

    cy.get('[data-test=undo]')
      .should('be.disabled');

    cy.wait(100);

    getElementAtPosition(startEventPosition)
      .moveTo(startEventMoveToPosition.x, startEventMoveToPosition.y)
      .should(position => {
        expect(position).to.not.deep.equal(startEventPosition);
      });

    cy.get('[data-test=undo]')
      .should('not.be.disabled')
      .click();

    getElementAtPosition(startEventPosition).should('exist');
    getElementAtPosition(startEventMoveToPosition).should('not.exist');

    const taskPosition1 = { x: 50, y: 400 };
    const taskPosition2 = { x: taskPosition1.x + 200, y: taskPosition1.y };
    const taskPosition3 = { x: taskPosition2.x + 200, y: taskPosition2.y };
    dragFromSourceToDest('processmaker-modeler-task', '.paper-container', taskPosition1);

    cy.wait(100);

    getElementAtPosition(taskPosition1)
      .click()
      .wait(100)
      .moveTo(taskPosition2.x, taskPosition2.y)
      .moveTo(taskPosition3.x, taskPosition3.y);

    cy.get('[data-test=undo]').click();

    cy.wait(100);

    getElementAtPosition(taskPosition2).should('exist');
    getElementAtPosition(taskPosition3).should('not.exist');
  });

  it('Can undo and redo sequence flow condition expression', () => {
    const exclusiveGatewayPosition = { x: 250, y: 250  };
    dragFromSourceToDest('processmaker-modeler-exclusive-gateway', '.paper-container', exclusiveGatewayPosition);

    const taskPosition = { x: 400, y: 500 };
    dragFromSourceToDest('processmaker-modeler-task', '.paper-container', taskPosition);

    connectNodesWithFlow('sequence-flow-button', exclusiveGatewayPosition, taskPosition);

    getElementAtPosition(exclusiveGatewayPosition)
      .then(getLinksConnectedToElement)
      .then($links => $links[0])
      .click({ force: true });

    const testString = 'foo > 7';
    typeIntoTextInput('[name=\'conditionExpression.body\']', testString);

    cy.get('[name=\'conditionExpression.body\']').should('have.value', testString);

    cy.get('[data-test=undo]').click();

    getElementAtPosition(taskPosition)
      .then(getLinksConnectedToElement)
      .then($links => $links[0])
      .click({ force: true });

    const emptyString = '';
    cy.get('[name=\'conditionExpression.body\']').should('have.value', emptyString);

    cy.get('[data-test=redo]').click();

    getElementAtPosition(exclusiveGatewayPosition)
      .then(getLinksConnectedToElement)
      .then($links => $links[0])
      .click({ force: true });

    cy.get('[name=\'conditionExpression.body\']').should('have.value', testString);
  });
});
