import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface RatingFormProps {
  serviceId: string;
  providerId: string;
}

export const RatingForm = ({ serviceId, providerId }: RatingFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async () => {
    const contacted = JSON.parse(localStorage.getItem("contactedServices") || "{}");
    const ipInfo = contacted[serviceId];

    // Validate contact first
    if (!ipInfo || !ipInfo.ip) {
      setDialogMessage("You must contact the provider before rating.");
      setShowDialog(true);
      return;
    }

    // Restrict multiple ratings from same IP within 24 hours
    const lastRatedTime = localStorage.getItem(`rated_${serviceId}_${ipInfo.ip}`);
    if (lastRatedTime && Date.now() - parseInt(lastRatedTime) < 24 * 60 * 60 * 1000) {
      setDialogMessage("You already rated this provider in the last 24 hours.");
      setShowDialog(true);
      return;
    }

    try {
      await addDoc(collection(db, "ratings"), {
        serviceId,
        providerId,
        rating,
        comment,
        timestamp: serverTimestamp(),
        ip: ipInfo.ip,
      });

      localStorage.setItem(`rated_${serviceId}_${ipInfo.ip}`, Date.now().toString());
      setDialogMessage("Thank you! Your rating has been submitted.");
      setShowDialog(true);
      setRating(0);
      setComment("");
    } catch (err) {
      setDialogMessage("Something went wrong. Please try again.");
      setShowDialog(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i + 1)}
            className={`text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        Submit Rating
      </Button>

      {/* Dialog for alerts */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notice</AlertDialogTitle>
            <AlertDialogDescription >{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowDialog(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
