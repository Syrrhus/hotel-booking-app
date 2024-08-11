import { common } from "../common/common";
const ascenda = new common();

describe("Validate All inputs fields on Guests Form", () => {
  before(() => {
    cy.viewport(1920, 1080);
    cy.visit(Cypress.env('baseURL'))
    // search hotel
    ascenda.enter_hotel_name("Rome, Italy");
    ascenda.enter_checkIn_date("15/08/2024");
    ascenda.enter_checkOut_date("19/08/2024");
    ascenda.enter_guest_details();
    ascenda.click_search_button();

    // check availability
    ascenda.wait_for_searched_results();
    ascenda.click_seeAvailability_button();
    ascenda.wait_for_available_rooms();

    // complete booking
    cy.scrollTo("bottom");
    ascenda.click_reserve_or_book_now_button();
    ascenda.fill_booking_details(
      2,
      "2024-09-15",
      "2024-10-15",
      2,
      3,
      "This is test booking"
    );
    ascenda.click_next_button();
  });

  for(let i =0; i<=Cypress.env('testLoopCount'); i++){
    it("verify alert pop appears with validation message when invalid Phone value entered", () => {
      ascenda.fill_guest_details(
        "Mr",
        "LUKE",
        "GEORGE",
        "9000 000",
        "test@gmail.com"
      );
      ascenda.click_next_button();
      ascenda.verify_alertPopup_contains_error(
        "Invalid phone number keyed! 59000000"
      );
    });

    it("verify alert pop appears with validation message when empty email submitted", () => {
      ascenda.fill_guest_details("Mr", "LUKE", "GEORGE", "9000 0000", ".");
      ascenda.click_next_button();
      ascenda.verify_alertPopup_contains_error(
        "Please enter a valid email address."
      );
    });

    it("verify alert pop appears with validation message when invalid email submitted", () => {
      ascenda.fill_guest_details("Mr", "LUKE", "GEORGE", "9000 0000", "test@");
      ascenda.click_next_button();
      ascenda.verify_alertPopup_contains_error(
        "Please enter a valid email address."
      );
    });
  }
});
