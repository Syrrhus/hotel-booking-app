import { common } from "../common/common"
const ascenda = new common()

describe("Validate All inputs fields on Payment Form", ()=>{

    before(()=>{
        cy.viewport(1920,1080)
        cy.visit(Cypress.env('baseURL'))
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
    })

    for(let i =0; i<=Cypress.env('testLoopCount'); i++){
        it("verify alert pop appears with validation message when empty billing and card details entered", ()=>{
            ascenda.confirm_booking()
            ascenda.verify_alertPopup_contains_error("Booking failed. Please try again.")
        })
    
        it("verify alert pop appears with validation message when empty card details entered", ()=>{
            ascenda.enter_billing_address("St. George Street 1, US")
            ascenda.confirm_booking()
            ascenda.verify_alertPopup_contains_error("Booking failed. Please try again.")
        })
    }
})