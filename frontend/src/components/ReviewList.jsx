import React from "react";

function ReviewList({ reviews = [] }) {
  return (
    <div className="review-list review-scroll-box">
      {reviews.length === 0 ? (
        <p className="review-empty">No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div className="review-item" key={review._id || index}>
            <div className="review-header">
              <span className="review-user">
                Buyer
              </span>
              <span className="review-rating">⭐ {review.rating}/5</span>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewList;