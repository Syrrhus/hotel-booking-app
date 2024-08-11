import { common } from "../common/common"
const ascenda = new common()

describe("Validate All inputs fields on Booking Form", ()=>{

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
    })

    for(let i =0; i<=Cypress.env('testLoopCount'); i++){
        it("verify alert pop appears with validation message when invalid Night value entered", ()=>{
            ascenda.fill_booking_details("invalid nights number", "2024-09-15", "2024-10-15", 2, 3, "This is test booking")
            ascenda.click_next_button()
            ascenda.verify_alertPopup_contains_error("invalid number of night entered")
        })
    
        it("verify alert pop appears with validation message when incorrect dates are passed", ()=>{
            ascenda.fill_booking_details(2, "2024-10-15", "2024-09-15", 2, 3, "This is test booking")
            ascenda.click_next_button()
            ascenda.verify_alertPopup_contains_error("The start date cannot be after the end date!")
        })
    
        it("verify alert pop appears with validation message when invalid Adult value entered", ()=>{
            ascenda.fill_booking_details(2, "2024-09-15", "2024-10-15", "invalid adult number", 3, "This is test booking")
            ascenda.click_next_button()
            ascenda.verify_alertPopup_contains_error("Please enter a valid value!")
        })
    
        it("verify alert pop appears with validation message when invalid Children value entered", ()=>{
            ascenda.fill_booking_details(2, "2024-09-15", "2024-10-15", 2, "invalid adult number", "This is test booking")
            ascenda.click_next_button()
            ascenda.verify_alertPopup_contains_error("Please enter a valid value!")
        })
    }
})