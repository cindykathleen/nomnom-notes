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