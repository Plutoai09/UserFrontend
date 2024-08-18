import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ReelPage.css';
import { useMediaQuery } from 'react-responsive';
import { useSwipeable } from 'react-swipeable';

export const ReelPage = () => {
    const [reels, setReels] = useState([]);
    const navigate = useNavigate();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' });

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const response = await fetch('https://flaskbackend-f7gwexxg4q-el.a.run.app/load');
                const data = await response.json();
                setReels(data);
            } catch (error) {
                console.error('Error fetching reels:', error);
            }
        };

        fetchReels();

        // Generate and append stars to the background
        const generateStars = () => {
            const numStars = 70;  // Number of stars
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'stars';
                const size = Math.random() * 3 + 1; // Random size between 1 and 4px
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.opacity = Math.random(); // Random opacity
                star.style.animationDuration = `${Math.random() * 2 + 1}s`; // Random animation duration between 1 and 3s
                document.body.appendChild(star);
            }
        };

        generateStars();

        // Clean up stars on unmount
        return () => {
            document.querySelectorAll('.stars').forEach(star => star.remove());
        };
    }, []);

    const handleBuyClick = (link) => {
        window.open(link, '_blank');
    };

    const Navbar = () => {
        return (
            <div className="navbar-home">
                <img
                    src="https://pbs.twimg.com/profile_images/1721227507893198848/goXiIldd_400x400.jpg"
                    alt="Abhishek Bhatnagar"
                    className="navbar-image"
                />
                <div className="navbar-text">
                    <h1 className="navbar-name">Abhishek Bhatnagar</h1>
                    <span className="navbar-subtitle">Pro Blogger, Entrepreneur, AI Expert</span>
                </div>
            </div>
        );
    };

    const handleChatClick = (topic, subtitle) => {
        navigate('/gtu/profile', { state: { fromReelPage: true, topic, subtitle } });
    };

    const handleAskClick = () => {
        navigate('/gtu/profile');
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            console.log('Swiped left');
        },
        onSwipedRight: () => {
            console.log('Swiped right');
        },
        trackMouse: true,
        trackTouch: true,
        preventDefaultTouchmoveEvent: true,
        delta: 50,
    });

    return (
        <div className = "bg">
            <Navbar/>
            <div className="top-review-products">
                <h1>Top Reviewed Products</h1>
            </div>

            <div className="carousel-container" {...handlers}>
                {!!reels.length && (
                    <Carousel
                        showThumbs={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={2000}
                        stopOnHover={true}
                        showStatus={false}
                        centerMode={true}
                        centerSlidePercentage={20.33}
                        emulateTouch={true}
                        swipeable={true}
                        preventMovementUntilSwipeScrollTolerance={true}
                        swipeScrollTolerance={50}
                    >
                        {reels.map((reel) => (
                            <div key={reel.id} className="reel-card">
                                <div className="black-div"></div>
                                <img src={reel.image_url} alt={reel.subtitle} className="reel-image" />
                                <p className='reel-headline'> {reel.subtitle}</p>
                                <div className="reel-details">
                                    <div className="button-container">
                                        <button
                                            className="buy-button"
                                            onClick={() => handleBuyClick(reel.affiliate)}
                                        >

<svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xmlSpace="preserve"
                style={{ marginRight: '5px', verticalAlign: 'middle' }}
            >
                <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 73.713 65.44 H 27.689 c -3.566 0 -6.377 -2.578 -6.686 -6.13 c -0.21 -2.426 0.807 -4.605 2.592 -5.939 L 16.381 21.07 c -0.199 -0.889 0.017 -1.819 0.586 -2.53 s 1.431 -1.124 2.341 -1.124 H 87 c 0.972 0 1.884 0.471 2.446 1.263 c 0.563 0.792 0.706 1.808 0.386 2.725 l -7.798 22.344 c -1.091 3.13 -3.798 5.429 -7.063 5.999 l -47.389 8.281 c -0.011 0.001 -0.021 0.003 -0.032 0.005 c -0.228 0.04 -0.623 0.126 -0.568 0.759 c 0.056 0.648 0.48 0.648 0.708 0.648 h 46.024 c 1.657 0 3 1.343 3 3 S 75.37 65.44 73.713 65.44 z" style={{ fill: 'rgb(0,0,0)' }} />
                    <circle cx="28.25" cy="75.8" r="6.5" style={{ fill: 'rgb(0,0,0)' }} />
                    <circle cx="68.29" cy="75.8" r="6.5" style={{ fill: 'rgb(0,0,0)' }} />
                    <path d="M 19.306 23.417 c -1.374 0 -2.613 -0.95 -2.925 -2.347 l -1.375 -6.155 c -0.554 -2.48 -2.716 -4.212 -5.258 -4.212 H 3 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 6.749 c 5.372 0 9.942 3.662 11.113 8.904 l 1.375 6.155 c 0.361 1.617 -0.657 3.221 -2.274 3.582 C 19.742 23.393 19.522 23.417 19.306 23.417 z" style={{ fill: 'rgb(0,0,0)' }} />
                </g>
            </svg>

                                            Buy
                                        </button>
                                        <button
                                            className="chat-button"
                                            onClick={() => handleChatClick(reel.title, reel.subtitle)}
                                        >


<svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xmlSpace="preserve"
                style={{ marginRight: '5px', verticalAlign: 'middle' }}
            >
                <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 80.071 14.56 H 9.929 C 4.454 14.56 0 19.014 0 24.489 v 41.505 c 0 5.476 4.454 9.93 9.929 9.93 h 3.57 l 9.272 9.271 c 0.585 0.586 1.354 0.879 2.121 0.879 s 1.536 -0.293 2.121 -0.879 l 9.272 -9.271 h 43.786 c 5.475 0 9.929 -4.454 9.929 -9.93 V 24.489 C 90 19.014 85.546 14.56 80.071 14.56 z M 69.381 55.4 H 20.619 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 48.762 c 1.657 0 3 1.343 3 3 S 71.038 55.4 69.381 55.4 z M 69.381 41.083 H 20.619 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 48.762 c 1.657 0 3 1.343 3 3 S 71.038 41.083 69.381 41.083 z" style={{ fill: 'rgb(0,0,0)' }} />
                </g>
            </svg>


                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>

            <div className="card-grid">
                {reels.map((reel) => (
                    <div key={reel.id} className="product-card">
                        <img src={reel.image_url} alt={reel.subtitle} className="product-image" />
                        <div className="button-container">
                            <button
                                className="buy-button"
                                onClick={() => handleBuyClick(reel.affiliate)}
                            >
                                Visit
                            </button>
                            <button
                                className="chat-button"
                                onClick={() => handleChatClick(reel.title, reel.subtitle)}
                            >
                                Chat
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="ask-more-container">
                <button className="ask-more-button" onClick={handleAskClick}>
                    <span>ASK MORE?</span>
                </button>
            </div>
            <div className="bottom-spacer"></div>
        </div>
    );
};

export default ReelPage;
