// src/components/RatingForm.tsx
import { useState } from "react";
import { Star } from "lucide-react";
import { addDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserIP } from "../lib/utils";

export const RatingForm = ({ serviceId, providerId }: { serviceId: string; providerId: string }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const ip = await getUserIP();
    if (!ip) return alert("IP could not be detected.");

    const contacted = JSON.parse(localStorage.getItem("contactedServices") || "{}");
    if (!contacted[serviceId]) return alert("You must click Contact before rating.");

    const q = query(
      collection(db, "ratings"),
      where("ip", "==", ip),
      where("providerId", "==", providerId)
    );
    const snap = await getDocs(q);

    const hasRatedRecently = snap.docs.some(doc => {
      const data = doc.data();
      const lastTime = data.createdAt?.toDate()?.getTime() || 0;
      return Date.now() - lastTime < 24 * 60 * 60 * 1000;
    });

    if (hasRatedRecently) {
      return alert("You've already rated this provider in the last 24 hours.");
    }

    await addDoc(collection(db, "ratings"), {
      providerId,
      serviceId,
      rating,
      comment,
      ip,
      createdAt: Timestamp.now(),
    });

    setSubmitted(true);
  };

  if (submitted) return <div className="text-green-600 font-medium">Thanks for your rating!</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={!rating}
      >
        Submit Rating
      </button>
    </div>
  );
};
