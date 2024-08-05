create database booking_system;
create user 'james'@'localhost' identified by 'james123';
grant all privileges on echo.* TO 'james'@'localhost';
flush privileges;

CREATE TABLE booking_info (
    id INT NOT NULL AUTO_INCREMENT,
    destinationID VARCHAR(255),
    hotelID VARCHAR(255),
    numberOfNights INT,
    startDate DATE,
    endDate DATE,
    adults INT,
    children INT,
    messageToHotel TEXT,
    roomTypes VARCHAR(255),
    price DECIMAL(10,2),
    bookingReference VARCHAR(255),
    guestID INT,
    PRIMARY KEY (id),
    KEY (guestID),
    FOREIGN KEY (guestID) REFERENCES guest_info(id)
);

CREATE TABLE guest_info (
    id INT NOT NULL AUTO_INCREMENT,
    salutation VARCHAR(10),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    PRIMARY KEY (id)
);


CREATE TABLE payment_info (
    id INT NOT NULL AUTO_INCREMENT,
    paymentID VARCHAR(255),
    payeeID VARCHAR(255),
    billingaddress TEXT,
    bookingID INT,
    PRIMARY KEY (id),
    FOREIGN KEY (bookingID) REFERENCES booking_info(id)
);