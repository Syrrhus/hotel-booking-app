import { common } from "../common/common";
const ascenda = new common();

describe("Validate All inputs fields on Home Page", () => {
  before(() => {
    cy.viewport(1920, 1080);
    cy.visit(Cypress.env('baseURL'))
  });

  for(let i =0; i<=Cypress.env('testLoopCount'); i++){
    it("verify required field error appears when search button is clicked with all empty fields", () => {
      // search hotel with empty details
      ascenda.click_search_button();
      ascenda.verify_all_required_field_validation(
        "Please fill in all required fields."
      );
    });

    it("verify required field error appears when only hotel name field is filled", () => {
      // search hotel with empty details
      ascenda.enter_hotel_name("Rome, Italy");
      ascenda.click_search_button();
      ascenda.verify_all_required_field_validation(
        "Please fill in all required fields."
      );
    });

    it("verify required field error appears when only Check In date is filled", () => {
      // search hotel with empty details
      ascenda.enter_checkIn_date("12/12/2025");
      ascenda.click_search_button();
      ascenda.verify_all_required_field_validation(
        "Please fill in all required fields."
      );
    });

    it("verify required field error appears when only Check Out date is filled", () => {
      // search hotel with empty details
      ascenda.enter_checkOut_date("12/12/2025");
      ascenda.click_search_button();
      ascenda.verify_all_required_field_validation(
        "Please fill in all required fields."
      );
    });
  }
});
