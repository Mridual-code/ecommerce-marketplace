import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../api/axios";

function WishlistButton({ productId }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem(
        "autocart_token"
      );

      if (!token) return;

      try {
       const res = await API.get(
  `/wishlist/check/${productId}`,
  {
    skipLoader: true
  }
);
        setAdded(res.data.added);
      } catch {
        setAdded(false);
      }
    };

    checkWishlist();
  }, [productId]);

  const toggleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem(
      "autocart_token"
    );

    if (!token) {
      toast.info(
        "Please login to use your wishlist"
      );
      navigate("/login");
      return;
    }

    try {
      const res = await API.patch(
  `/wishlist/toggle/${productId}`,
  {},
  {
    skipLoader: true
  }
);

      setAdded(res.data.added);
      toast.success(res.data.message);

      window.dispatchEvent(
        new Event("wishlist-updated")
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Wishlist is available to customers only"
      );
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-button ${
        added ? "active" : ""
      }`}
      onClick={toggleWishlist}
      title={
        added
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      aria-label={
        added
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
    >
      {added ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default WishlistButton;