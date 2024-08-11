import locators from "../elements/locators";

export class common {
    enter_hotel_name(hotelName){
        cy.get(locators.destinationNameInput).should("be.visible")
        cy.get(locators.destinationNameInput).clear().type(hotelName).wait(100)
        cy.get(locators.listOfDestinations).should("be.visible").wait(100)
        cy.xpath(locators.destinationOption(hotelName)).first().click()
    }

    enter_checkIn_date(checkInDate){
        cy.get(locators.checkInOutDateInput).first().should("be.visible")
        cy.get(locators.checkInOutDateInput).first().clear().type(checkInDate).wait(100)
    }

    enter_checkOut_date(checkOutDate){
        cy.get(locators.checkInOutDateInput).last().should("be.visible")
        cy.get(locators.checkInOutDateInput).last().clear().type(checkOutDate).wait(100)
    }

    enter_guest_details(){
        cy.get(locators.guestAdultInput).click().wait(100)
        cy.get(locators.addGuestIcon).first().parent().click().wait(100)
        cy.get(locators.addGuestIcon).eq(1).parent().click().wait(100)
        cy.get(locators.addGuestIcon).last().parent().click().wait(100)
    }

    click_search_button(){
        cy.xpath(locators.searchButton).click().wait(100)
    }

    wait_for_searched_results(){
        cy.get(locators.searchedResults).should("be.visible").wait(100)
    }

    click_seeAvailability_button(){
        cy.wait(10000)
        cy.get(locators.availablePricing).first().should("contains.text", "$")
        cy.get(locators.seeAvailabilityButton).first().click().wait(100)
    }

    wait_for_available_rooms(){
        cy.get(locators.reserveOrBookNowButton).scrollIntoView().wait(100).should("be.visible")
    }

    click_reserve_or_book_now_button(){
        cy.get(locators.reserveOrBookNowButton).first().click().wait(100)
    }

    fill_booking_details(nights, sdate, edate, adults, children, sr){
        cy.get(locators.numberOfNightInput).clear().type(nights).wait(100)
        cy.get(locators.startDate).clear().type(sdate).wait(100)
        cy.get(locators.endDate).clear().type(edate).wait(100)
        cy.get(locators.adultsInput).clear().type(adults).wait(100)
        cy.get(locators.childernInput).clear().type(children).wait(100)
        cy.get(locators.specialRequestTextBox).clear().type(sr).wait(100)
    }

    click_next_button(){
        cy.xpath(locators.nextButton).click().wait(100)
    }

    fill_guest_details(salutation, fName, lName, phone, email){
        cy.get(locators.saluationDropDown).select(salutation).wait(100)
        cy.get(locators.firstNameInput).clear().type(fName).wait(100)
        cy.get(locators.lastNameInput).clear().type(lName).wait(100)
        cy.get(locators.phoneNumberInput).clear().type(phone).wait(100)
        cy.get(locators.emailInput).clear().type(email).wait(100)
    }

    click_confirm_and_pay_button(){
        cy.xpath(locators.confirmAndPayButton).should("be.visible").click().wait(100)
    }

    enter_billing_address(billingAddress){
        cy.get(locators.billingAddressInput).clear().type(billingAddress).wait(100)
    }

    enter_card_details(cardNo, expiry, cvcNo){
        cy.get(locators.cardNumberInput).should("be.visible")
        cy.get(locators.cardNumberInput).clear().type(cardNo).wait(100)
        cy.get(locators.cardExpiryInput).clear().type(expiry).wait(100)
        cy.get(locators.cvcInput).clear().type(cvcNo).wait(100)
    }

    confirm_booking(){
        cy.xpath(locators.confirmBookingButton).click()
    }

    verify_all_required_field_validation(errorMessage){
        cy.get(locators.errorMessage).should("be.visible")
        cy.get(locators.errorMessage).should("contain.text", errorMessage)
    }

    verify_alertPopup_contains_error(errorMessage){
        cy.on('window:alert', (str) => {
            expect(str).to.equal(errorMessage);
          });
    }
}