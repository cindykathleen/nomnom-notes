export function fillSignUpForm({
  name, email, password, passwordConfirmation
}: {
  name: string, email: string, password: string, passwordConfirmation: string
}) {
  cy.get('input[name="display-name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[id="password-confirmation"]').type(passwordConfirmation)
}

export function fillSignInForm({ email, password }: { email: string, password: string }) {
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
}

export function clickStar(index: number, side: 'left' | 'right') {
  cy.get('[data-cy=rating-system]')
    .find('svg')
    .should('have.length', 5)
    .eq(index - 1).then($star => {
      const width = $star.width();
      const height = $star.height();

      if (!width || !height) return;

      const x = side === 'left' ? width / 4 : (3 * width) / 4;
      const y = height / 2;

      cy.wrap($star).click(x, y, { force: true });
    });
}