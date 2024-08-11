import { common } from "../common/common"
const ascenda = new common()

describe("Perform Complete Hotel Booking Flow", ()=>{
    before(()=>{
        cy.visit(Cypress.env('baseURL'))
    })


    it("Book a hotel", ()=>{
        // search hotel
        ascenda.enter_hotel_name("Rome, Italy")
        ascenda.enter_checkIn_date("15/08/2024")
        ascenda.enter_checkOut_date("19/08/2024")
        ascenda.enter_guest_details()
        ascenda.click_search_button()

        // check availability
        ascenda.wait_for_searched_results()
        ascenda.click_seeAvailability_button()
        ascenda.wait_for_available_rooms()

        // complete booking
        cy.scrollTo("bottom")
        ascenda.click_reserve_or_book_now_button()
        ascenda.fill_booking_details(2, "2024-09-15", "2024-10-15", 2, 3, "This is test booking")
        ascenda.click_next_button()
        ascenda.fill_guest_details("Mr", "LUKE", "GEORGE", "9000 0000", "test@gmail.com")
        ascenda.click_next_button()
        ascenda.click_confirm_and_pay_button()
        ascenda.enter_billing_address("St. George Street 1, US")
        ascenda.enter_card_details("4242424242424242", "12/34", "433")
        ascenda.confirm_booking()
    })
})