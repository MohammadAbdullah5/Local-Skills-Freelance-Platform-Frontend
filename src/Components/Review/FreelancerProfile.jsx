import React, { useState , useEffect } from 'react';
import Review from './Review';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from 'axios';


const FreelancerProfile = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { order_id, buyer_id } = location.state || {};
    const { currentUser } = useSelector((state) => state.user);
    // use Effect to get the freelancer data
    useEffect(() => {

        const getFreelancerData = async () => {
            try {
              const response = await axios.post("http://localhost:8080/review/reviewdata", {
                order_id,
                buyer_id,
              });
              
              console.log('Freelancer data:', response.data);
            } catch (error) {
                console.error('Error fetching freelancer data:', error);
            }
        };
        getFreelancerData();


    }, []);




    const freelancer = {
        id: 1,
        name: currentUser?.name,
        description: "I am a professional freelancer with 5 years of experience in web development.",
        image: 'https://via.placeholder.com/80',
        reviews: [
            { clientName: "John Smith", rating: 5, comment: "Great job!", timestamp: "2024-09-01T14:00:00Z" },
            { clientName: "Alice Brown", rating: 4, comment: "Good work but could improve communication.", timestamp: "2024-09-02T10:00:00Z" }
        ]
    };
    const [reviews, setReviews] = useState(freelancer.reviews);

    const addReview = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    return (
        <div className="container mx-auto px-4 mt-3">
            <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-6">
                    {/* Freelancer Display Picture */}
                    <img
                        src={'https://via.placeholder.com/80'}
                        alt={`${freelancer.name} profile`}
                        className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{freelancer.name}</h2>
                        <p>{freelancer.description}</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-2">Reviews</h3>
                <div className="space-y-4">
                    {reviews.length ? (
                        reviews.map((review, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm font-bold">{review.clientName}</div>
                                    <div className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString()}</div>
                                </div>
                                <div className="text-yellow-500">
                                    {Array(review.rating).fill('★').join('')}
                                    {Array(5 - review.rating).fill('☆').join('')}
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>

                <Review order_id={order_id} buyer_id={buyer_id} />
            </div>
        </div>
    );
};

export default FreelancerProfile;
