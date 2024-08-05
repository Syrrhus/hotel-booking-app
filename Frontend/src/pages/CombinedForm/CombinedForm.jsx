import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from '../../components/progressbar/ProgressBar';
import BookingDetails from './BookingDetails';
import GuestDetails from './GuestDetails';
import PaymentDetails from './PaymentDetails';
import Confirmation from './Confirmation';
import './combinedform.css';
import Navbar from '../../components/navbar/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const CombinedForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hotel = location.state.hotel;
    const [step, setStep] = useState(1);
    const [bookingInfo, setBookingInfo] = useState({
        destinationID: hotel.original_metadata.country,
        hotelID: hotel.id,
        numberOfNights: '',
        startDate: '',
        endDate: '',
        adults: 0,
        children: 0,
        messageToHotel: '',
        roomTypes: ''
    });

    const [guestInfo, setGuestInfo] = useState({
        salutation: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });

    const [paymentInfo, setPaymentInfo] = useState({
        billingAddress: '',
        cardNumber: '',
        cvc: '',
        cardExpiry: ''
    });

    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in guestInfo) {
            setGuestInfo((prevState) => ({
                ...prevState,
                [name]: value
            }));
        } else if (name in paymentInfo) {
            setPaymentInfo((prevState) => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setBookingInfo((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = {
            ...bookingInfo,
            ...guestInfo,
            ...paymentInfo,
            cardNumber: value
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Booking successful! Your booking reference is ' + result.bookingReference);
                navigate(`/hotels/${hotel.id}`, { state: { hotel } });
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Booking failed. Please try again.');
        }
    };

    const handleNavigate = () => {
        navigate(`/hotels/${hotel.id}`, { state: { hotel } });
    };

    const photos = hotel.image_details.prefix
        ? Array.from({ length: hotel.imageCount }, (_, i) => ({
            src: `${hotel.image_details.prefix}${i}${hotel.image_details.suffix}`
        }))
        : [];

    return (
        <div>
            <Navbar style={{ position: "sticky" }} />
            <div className='formcontainer'>
                <div className="paymentcontainer">
                    <div className="combinedform-container">
                        <h1>Finalize Booking</h1>
                        <ProgressBar step={step} />
                        {step === 1 && <BookingDetails bookingInfo={bookingInfo} handleChange={handleChange} nextStep={nextStep} />}
                        {step === 2 && <GuestDetails guestInfo={guestInfo} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
                        {step === 3 && <Confirmation bookingInfo={bookingInfo} guestInfo={guestInfo} prevStep={prevStep} nextStep={nextStep} />}
                        {step === 4 && <PaymentDetails paymentInfo={paymentInfo} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} value={value} setValue={setValue} />}
                    </div>
                    <div className="paymenthotelDetailsWrapper">
                        <h2>{hotel.name}</h2>
                        <div className="hotelAddress">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>{hotel.address}</span>
                        </div>
                        <span className="hotelRating">Rating: {hotel.rating}</span>
                        <span className="hotelDistance">Excellent location: {hotel.distance.toFixed(2)}m</span>
                        <span className="hotelPriceHighlight">Price: ${hotel.price}</span>
                        <div className="hotelImages">
                            <div className="carousel">
                                <div className="carouselWrapper">
                                    <img src={photos[1].src} alt="" className="carouselImg" />
                                </div>
                            </div>
                        </div>
                        <div className="hotelDetails">
                            <div className="hotelDetailsTexts">
                                <div className="hotelCategories">
                                    <h2>Categories</h2>
                                    {Object.keys(hotel.categories).map((key) => (
                                        <div key={key}>
                                            <p>{hotel.categories[key].name}: {hotel.categories[key].score}</p>
                                            <p>Popularity: {hotel.categories[key].popularity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="hotelAmenitiesRatings">
                                    <h2>Amenities Ratings</h2>
                                    {hotel.amenities_ratings.map((amenity, index) => (
                                        <div key={index}>
                                            <p>{amenity.name}: {amenity.score}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="hotelAmenities">
                                    <h2>Amenities</h2>
                                    <ul>
                                        {Object.keys(hotel.amenities).map((key) => (
                                            <li key={key}>{key.replace(/([A-Z])/g, ' $1')}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default CombinedForm;
