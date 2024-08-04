import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from '../../components/progressbar/ProgressBar';
import BookingDetails from './BookingDetails';
import GuestDetails from './GuestDetails';
import PaymentDetails from './PaymentDetails';
import Confirmation from './Confirmation';
import { validateCardExpiry, validateCVC, validateCardNumber, validateNumNights, validatePhoneNumber, dateDifference } from './validation';
import './combinedform.css';
import Navbar from '../../components/navbar/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";

const CombinedForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hotel = location.state.hotel;
    const [slideNumber, setSlideNumber] = useState(0);


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

    const [errors, setErrors] = useState({});
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

    const handleThumbnailClick = (index) => {
        setSlideNumber(index);
    };

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validatePhoneNumber(guestInfo.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be between 80000000 and 90000000';
            alert("Invalid phone number keyed!");
        }
        else if (!validateCardNumber(value)) {
            newErrors.creditCardNumber = 'Card number is invalid';
            alert("Invalid card number keyed!");
        }
        else if (!validateCVC(paymentInfo.cvc)) {
            newErrors.cardNumber = 'cvc is invalid';
            alert("Invalid cvc keyed!");
        }
        else if (!validateCardExpiry(paymentInfo.cardExpiry)) {
            newErrors.cardExpiry = 'card has expiry';
            alert("Please use a card that has not expired!");
        } else if (!validateNumNights(bookingInfo.numberOfNights)) {
            newErrors.numberOfNights = 'Please enter valid days you intend to stay';
            alert("Invalid number of nights entered");
        } else if (!dateDifference(bookingInfo.startDate, bookingInfo.endDate)) {
            alert("Invalid start or end date entered");
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
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
                        {/* <h2>{hotel.name}</h2> */}
                        <ProgressBar step={step} />
                        {step === 1 && <BookingDetails bookingInfo={bookingInfo} handleChange={handleChange} nextStep={nextStep} />}
                        {step === 2 && <GuestDetails guestInfo={guestInfo} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
                        {step === 3 && <PaymentDetails paymentInfo={paymentInfo} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} value={value} setValue={setValue} />}
                        {step === 4 && <Confirmation bookingInfo={bookingInfo} guestInfo={guestInfo} paymentInfo={{ ...paymentInfo, cardNumber: value }} handleSubmit={handleSubmit} prevStep={prevStep} />}
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
                                {/* <h1 className="hotelTitle">Stay in the heart of {hotel.original_metadata.city}</h1>
                            <p className="hotelDesc" dangerouslySetInnerHTML={{ __html: hotel.description }}></p>
                            <div className="hotelTrustYouScores">
                                <h2>TrustYou Scores</h2>
                                <p>Overall: {hotel.trustyou.score.overall}</p>
                                <p>Kaligo Overall: {hotel.trustyou.score.kaligo_overall}</p>
                                <p>Solo: {hotel.trustyou.score.solo}</p>
                                <p>Couple: {hotel.trustyou.score.couple}</p>
                                <p>Family: {hotel.trustyou.score.family}</p>
                                <p>Business: {hotel.trustyou.score.business}</p>
                            </div> */}
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
