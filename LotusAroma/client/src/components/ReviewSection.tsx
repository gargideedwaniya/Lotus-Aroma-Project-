import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insertReviewSchema } from '@shared/schema';
import { Review } from '@shared/schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const reviewFormSchema = insertReviewSchema.extend({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: "Review comment must be at least 10 characters.",
  }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewSectionProps {
  productId: number;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
  });
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      username: '',
      rating: 5,
      comment: '',
      productId,
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (reviewData: ReviewFormValues) => {
      return await apiRequest('POST', `/api/products/${productId}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your thoughts!",
      });
      form.reset();
      setIsFormVisible(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ReviewFormValues) => {
    mutation.mutate(data);
  };
  
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-[#D4AF37]">
        {Array.from({ length: 5 }).map((_, i) => (
          <i 
            key={i} 
            className={i < rating ? "fas fa-star" : "far fa-star"}
          ></i>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold font-playfair">Customer Reviews</h3>
        
        <Button 
          variant="outline"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>
      
      {isFormVisible && (
        <div className="bg-neutral-50 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold mb-4">Share Your Thoughts</h4>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className={`text-2xl focus:outline-none ${
                              star <= field.value ? 'text-[#D4AF37]' : 'text-gray-300'
                            }`}
                          >
                            <i className="fas fa-star"></i>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your experience with this product..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-500">Loading reviews...</p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{review.username}</h4>
                  <p className="text-sm text-neutral-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-neutral-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-neutral-50">
          <i className="far fa-comment-dots text-4xl text-neutral-300 mb-3"></i>
          <p className="text-neutral-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
