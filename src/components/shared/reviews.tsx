"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
};

type ReviewsProps = {
  initialReviews: Review[];
};

export default function Reviews({ initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userComment || userRating === 0) return;

    const newReview: Review = {
      id: reviews.length + 1,
      name: userName,
      rating: userRating,
      comment: userComment,
    };
    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setUserName("");
    setUserComment("");
    setUserRating(0);
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Add Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">{review.name}</h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Modal for Adding Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-700" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Add Your Review
            </h3>

            {/* Rating Selector */}
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 cursor-pointer transition ${
                    i < userRating ? "text-yellow-400" : "text-slate-300"
                  }`}
                  onClick={() => setUserRating(i + 1)}
                />
              ))}
              <span className="ml-2 text-sm text-slate-500">
                {userRating} / 5
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Your Review"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
