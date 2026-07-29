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

describe('Homepage social sidebar', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })

  it('shows follower request and approve adds to followers', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/')
        cy.get('[data-cy=social-sidebar]').should('be.visible')
        cy.get(`[data-cy=social-sidebar] [data-cy=social-user-${requesterId}]`).should(
          'contain.text',
          'Private User'
        )
        cy.get('[data-cy=social-sidebar] [data-cy=approve-follow-request]').click()
        cy.get('[data-cy=social-sidebar] [data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=social-sidebar] [data-cy=followers-list]').should(
          'contain.text',
          'Private User'
        )

        cy.task('removePrivateUser', requesterId)
      })
    })
  })

  it('deny removes follower request', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/')
        cy.get(`[data-cy=social-sidebar] [data-cy=social-user-${requesterId}]`).should(
          'be.visible'
        )
        cy.get('[data-cy=social-sidebar] [data-cy=deny-follow-request]').click()
        cy.get('[data-cy=social-sidebar] [data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=social-sidebar] [data-cy=no-followers]').should('be.visible')

        cy.task('removePrivateUser', requesterId)
      })
    })
  })
})

describe('Homepage follow request queue (mobile)', () => {
  beforeEach(() => {
    cy.viewport(375, 667)
  })

  it('shows one request at a time and advances after approve', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((firstRequesterId) => {
        cy.task('addFeedActor', { name: 'Second Requester' }).then((secondRequesterId) => {
          cy.task('requestFollow', { requesterId: firstRequesterId, followeeId: testUserId })
          cy.task('requestFollow', { requesterId: secondRequesterId, followeeId: testUserId })

          cy.visit('/')
          cy.get('[data-cy=social-sidebar]').should('not.be.visible')
          cy.get('[data-cy=follow-request-queue]').should('be.visible')
          cy.get('[data-cy=follow-request-queue] [data-cy=view-all-requests]').should(
            'contain.text',
            'View all (2)'
          )
          // Newest request is shown first ($addToSet order — second added is newest)
          cy.get(`[data-cy=follow-request-queue] [data-cy=social-user-${secondRequesterId}]`).should(
            'be.visible'
          )
          cy.get(`[data-cy=follow-request-queue] [data-cy=social-user-${firstRequesterId}]`).should(
            'not.exist'
          )

          cy.get('[data-cy=follow-request-queue] [data-cy=approve-follow-request]').click()
          cy.get('[data-cy=follow-request-queue] [data-cy=view-all-requests]').should(
            'contain.text',
            'View all (1)'
          )
          cy.get(`[data-cy=follow-request-queue] [data-cy=social-user-${firstRequesterId}]`).should(
            'be.visible'
          )

          cy.get('[data-cy=follow-request-queue] [data-cy=approve-follow-request]').click()
          cy.get('[data-cy=follow-request-queue]').should('not.exist')

          cy.task('removePrivateUser', firstRequesterId)
          cy.task('removeFeedActor', secondRequesterId)
        })
      })
    })
  })
})
