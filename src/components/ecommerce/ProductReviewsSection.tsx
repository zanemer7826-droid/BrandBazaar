import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Plus,
  Filter,
  UserCheck,
  Send,
  X,
} from 'lucide-react';
import { Product, ProductReview } from '../../types/ecommerce';
import { generateDefaultReviews } from '../../data/mockReviews';

interface ProductReviewsSectionProps {
  product: Product;
  primaryColor?: string;
  onReviewsUpdated?: (count: number, avgRating: number) => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  primaryColor = '#4f46e5',
  onReviewsUpdated,
}) => {
  const storageKey = `bb_reviews_${product.id}`;

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return generateDefaultReviews(product.id, product.name, product.category);
  });

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'ALL'>('ALL');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRecommended, setNewRecommended] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews, storageKey]);

  // Calculate rating stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : product.rating.toFixed(1);

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const filteredReviews = reviews.filter((r) => {
    if (selectedStarFilter === 'ALL') return true;
    return Math.round(r.rating) === selectedStarFilter;
  });

  const handleLike = (reviewId: string) => {
    setLikedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isLiked = likedReviews[reviewId];
          return {
            ...r,
            helpfulCount: isLiked ? r.helpfulCount - 1 : r.helpfulCount + 1,
          };
        }
        return r;
      })
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newTitle.trim() || !newComment.trim()) return;

    const newReviewItem: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: newAuthor.trim(),
      city: newCity.trim() || 'Verified Customer',
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
      helpfulCount: 0,
      recommended: newRecommended,
      tag: 'Verified Reviewer',
    };

    const updated = [newReviewItem, ...reviews];
    setReviews(updated);
    setSubmitSuccess(true);
    setIsWritingReview(false);

    // Reset form
    setNewAuthor('');
    setNewCity('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);

    const newAvg = updated.reduce((a, b) => a + b.rating, 0) / updated.length;
    onReviewsUpdated?.(updated.length, Number(newAvg.toFixed(1)));

    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. RATINGS SUMMARY & SCORECARD */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">
                {averageRating}
              </div>
              <div className="flex items-center justify-center text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {totalReviews} verified ratings
              </p>
            </div>

            {/* Star Distribution Bars */}
            <div className="flex-1 min-w-[140px] sm:min-w-[180px] space-y-1 text-[10px]">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars] || 0;
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <button
                    key={stars}
                    onClick={() =>
                      setSelectedStarFilter((prev) => (prev === stars ? 'ALL' : stars))
                    }
                    className={`w-full flex items-center space-x-2 py-0.5 px-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${
                      selectedStarFilter === stars ? 'bg-indigo-50 dark:bg-indigo-950/50 font-bold' : ''
                    }`}
                  >
                    <span className="w-3 text-slate-600 dark:text-slate-300">{stars}★</span>
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action to Write Review */}
          <div className="flex flex-col sm:items-end justify-center">
            <button
              onClick={() => setIsWritingReview((prev) => !prev)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center space-x-1.5 transition-all hover:opacity-95"
              style={{ backgroundColor: primaryColor }}
            >
              {isWritingReview ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-400 mt-1.5 text-center sm:text-right">
              98% of buyers recommend this product
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedStarFilter('ALL')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
              selectedStarFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            All ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStarFilter(s)}
              className={`px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
                selectedStarFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {s} ★ ({starCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* 2. SUCCESS NOTICE */}
      {submitSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Thank you! Your review has been published and verified.</span>
        </div>
      )}

      {/* 3. INTERACTIVE WRITE REVIEW FORM */}
      {isWritingReview && (
        <form
          onSubmit={handleReviewSubmit}
          className="p-5 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/10 dark:bg-indigo-950/20 space-y-4 animate-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Share Your Feedback</span>
            </h4>
            <span className="text-[10px] text-slate-400">Verified Customer Review</span>
          </div>

          {/* Star Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Overall Rating
            </label>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setNewRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${s <= newRating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                {newRating === 5
                  ? 'Excellent, Loved it!'
                  : newRating === 4
                  ? 'Very Good'
                  : newRating === 3
                  ? 'Average'
                  : 'Below expectations'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Mumbai, MH"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Headline / Summary *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Unbelievable build quality and fast shipping!"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Detailed Review *
            </label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell other shoppers what you liked about the material, comfort, battery, or packaging..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={newRecommended}
                onChange={(e) => setNewRecommended(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>I recommend this product to other buyers</span>
            </label>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. REVIEWS LIST */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            No reviews match the selected filter. Be the first to share your thoughts!
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {rev.author}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      {rev.city && <span>{rev.city}</span>}
                      {rev.city && <span>&bull;</span>}
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center text-amber-400 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                  {rev.title}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {rev.comment}
                </p>
              </div>

              {/* Review Footer / Helpful Vote */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-500">
                  {rev.recommended ? '✓ Recommends this item' : ''}
                </span>

                <button
                  type="button"
                  onClick={() => handleLike(rev.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                    likedReviews[rev.id]
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                  title="Mark as helpful"
                >
                  <ThumbsUp className={`w-3 h-3 ${likedReviews[rev.id] ? 'fill-current' : ''}`} />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
