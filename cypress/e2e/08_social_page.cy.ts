before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')
  cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
    cy.task('resetUserSocial', testUserId)
  })
})

describe('Social page', () => {
  it('shows follower request and approve adds to followers', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/social')
        cy.get(`[data-cy=social-user-${requesterId}]`).should('contain.text', 'Private User')
        cy.get('[data-cy=approve-follow-request]').click()
        cy.get('[data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=followers-list]').should('contain.text', 'Private User')

        cy.task('removePrivateUser', requesterId)
      })
    })
  })

  it('deny removes follower request', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/social')
        cy.get(`[data-cy=social-user-${requesterId}]`).should('be.visible')
        cy.get('[data-cy=deny-follow-request]').click()
        cy.get('[data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=no-followers]').should('be.visible')

        cy.task('removePrivateUser', requesterId)
      })
    })
  })
})
