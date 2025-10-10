before(() => {
  cy.task('clearData')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the lists page
  cy.visit('/lists')
})

describe('Lists page', () => {
  it('Create a list', () => {
    // Open the add modal
    cy.get('[data-cy=add-list-modal-trigger]').click()
    cy.get('[data-cy=add-list-modal]').should('be.visible')

    // Fill out the add form
    cy.get('input[name="list-name"]').type('Test List')
    cy.get('textarea[name="list-description"]').type('This is a test list.')
    cy.get('input[name="img-url"]').type('https://placehold.co/400')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy=list]').should('be.visible')
    cy.get('[data-cy=list]').find('p').should('contain.text', 'Test List')
  })

  it('Update list', () => {
    // Open the edit modal
    cy.get('[data-cy=list-menu-modal-trigger]').click()
    cy.get('[data-cy=list-menu-modal]').should('be.visible')
    cy.get('[data-cy=edit-list-modal-trigger]').click()
    cy.get('[data-cy=edit-list-modal]').should('be.visible')

    // Fill out the update form
    cy.get('input[name="list-name"]').clear().type('Edited Test List')
    cy.get('input[name="list-visibility"]').check('public')
    cy.get('textarea[name="list-description"]').clear().type('This is an edited test list.')
    cy.get('[data-cy=image-input-type-trigger]').click()
    cy.get('input[type="file"]').selectFile('cypress/fixtures/placeholder.jpg')

    // Submit the form
    cy.get('button[data-cy="edit-list-submit"]').click()
    cy.get('[data-cy=list]').find('p').should('contain.text', 'Edited Test List')
  })

  it('Delete list', () => {
    // Open the delete modal
    cy.get('[data-cy=list-menu-modal-trigger]').click()
    cy.get('[data-cy=list-menu-modal]').should('be.visible')
    cy.get('[data-cy=delete-list-modal-trigger]').click()
    cy.get('[data-cy=delete-list-modal]').should('be.visible')

    // Delete the list
    cy.get('[data-cy=delete-list-button]').click()
    cy.get('[data-cy=list]').should('not.exist')
  })
})