before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')
})

describe('Rankings page', () => {
  beforeEach(() => {
    cy.visit('/rankings')
  })

  it('Create a ranking', () => {
    cy.get('[data-cy=add-ranking-modal-trigger]').click()
    cy.get('[data-cy=add-ranking-modal]').should('be.visible')

    cy.get('input[name="ranking-name"]').type('Test Ranking')
    cy.get('textarea[name="ranking-description"]').type('This is a test ranking.')
    cy.get('input[name="img-file"]').selectFile('cypress/fixtures/placeholder.jpg')

    cy.get('button[type="submit"]').click()
    cy.get('[data-cy=ranking]').should('be.visible')
    cy.get('[data-cy=ranking]').find('h5').should('contain.text', 'Test Ranking')
  })

  it('Update ranking', () => {
    cy.get('[data-cy=ranking-menu-modal-trigger]').click()
    cy.get('[data-cy=ranking-menu-modal]').should('be.visible')
    cy.get('[data-cy=edit-ranking-modal-trigger]').click()
    cy.get('[data-cy=edit-ranking-modal]').should('be.visible')

    cy.get('input[name="ranking-name"]').clear().type('Edited Test Ranking')
    cy.get('textarea[name="ranking-description"]').clear().type('This is an edited test ranking.')

    cy.get('button[data-cy="edit-ranking-submit"]').click()
    cy.get('[data-cy=ranking]').find('h5').should('contain.text', 'Edited Test Ranking')
  })
})

describe('Ranking detail page', () => {
  beforeEach(() => {
    cy.visit('/rankings')
    cy.get('[data-cy=ranking]').click()
  })

  it('Add a saved restaurant to the ranking', () => {
    cy.get('[data-cy=ranking-add-trigger]').click()
    cy.get('[data-cy=add-to-ranking-modal]').should('be.visible')
    cy.get('[data-cy=add-to-ranking-option]').contains('Chipotle Mexican Grill').click()

    cy.get('[data-cy=ranked-restaurant]').should('be.visible')
    cy.get('[data-cy=ranked-restaurant]').should('contain.text', 'Chipotle Mexican Grill')
  })

  it('Remove a restaurant from the ranking', () => {
    cy.get('[data-cy=remove-ranked-restaurant-trigger]').click()
    cy.get('[data-cy=remove-ranked-restaurant-modal]').should('be.visible')
    cy.get('[data-cy=remove-ranked-restaurant-button]').click()

    cy.get('[data-cy=ranked-restaurant]').should('not.exist')
  })
})

describe('Rankings navigation and profile', () => {
  it('Opens rankings from the nav icon', () => {
    cy.visit('/')
    cy.get('[data-cy=rankings-nav-button]').click()
    cy.location('pathname').should('eq', '/rankings')
    cy.get('[data-cy=ranking]').should('be.visible')
  })

  it('Shows rankings on the profile page', () => {
    cy.visit('/')
    cy.get('[data-cy=profile-button]').click()
    cy.get('[data-cy=view-profile-button]').click()

    cy.get('[data-cy=profile-rankings-count]').should('contain.text', '1')
    cy.contains('h4', 'Rankings').should('be.visible')
    cy.contains('Edited Test Ranking').should('be.visible')
  })

  it('View all rankings opens the activity rankings tab', () => {
    cy.visit('/')
    cy.get('[data-cy=profile-button]').click()
    cy.get('[data-cy=view-profile-button]').click()

    cy.get('[data-cy=profile-rankings-count]').click()
    cy.location('hash').should('eq', '#rankings')
    cy.get('[data-cy=tab-rankings]').should('be.visible')
  })
})

describe('Delete ranking', () => {
  it('Deletes a ranking', () => {
    cy.visit('/rankings')

    cy.get('[data-cy=ranking-menu-modal-trigger]').click()
    cy.get('[data-cy=ranking-menu-modal]').should('be.visible')
    cy.get('[data-cy=delete-ranking-modal-trigger]').click()
    cy.get('[data-cy=delete-ranking-modal]').should('be.visible')

    cy.get('[data-cy=delete-ranking-button]').click()
    cy.get('[data-cy=ranking]').should('not.exist')
  })
})
