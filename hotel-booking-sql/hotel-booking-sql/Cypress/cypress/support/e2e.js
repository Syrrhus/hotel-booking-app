import './commands'
import 'cypress-xpath'

beforeEach(()=>{
    // cy.restoreLocalStorageCache();
    cy.viewport(1920,1080)
})

afterEach(()=>{
    // cy.saveLocalStorageCache()
})