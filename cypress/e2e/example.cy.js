// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })


  it('visits the about', () => {
    cy.visit('/about')
    cy.contains('h1', 'aboutx page')
  })
})
