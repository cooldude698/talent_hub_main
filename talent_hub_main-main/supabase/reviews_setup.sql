-- supabase/reviews_setup.sql

-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert a review (anonymously or logged in)
CREATE POLICY "Anyone can insert a review"
    ON public.reviews FOR INSERT
    WITH CHECK (true);

-- Create policy to allow anyone to read approved reviews
CREATE POLICY "Anyone can read approved reviews"
    ON public.reviews FOR SELECT
    USING (approved = true);

-- Policies for admins to manage reviews would go here, 
-- but assuming superadmin can bypass RLS via service role or specific admin UUID.
