-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    delivery_time TEXT,
    icon_name TEXT,
    base_price INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on services"
    ON public.services
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert/update/delete (Admin functionality can be restricted further)
CREATE POLICY "Allow true admin to insert on services"
    ON public.services
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow true admin to update on services"
    ON public.services
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial services
INSERT INTO public.services (name, description, delivery_time, icon_name, base_price) VALUES
('UGC Videos', 'Authentic user-generated content videos that drive engagement and conversions.', '3-5 days', 'Video', 300),
('Web Development', 'Custom websites and web applications built with modern technologies.', '7-14 days', 'Globe', 1500),
('Content Writing', 'SEO-optimized articles, blog posts, and marketing copy.', '2-3 days', 'FileText', 150),
('Script Writing', 'Compelling scripts for videos, podcasts, and presentations.', '2-4 days', 'ScrollText', 200),
('Video Editing', 'Professional video editing with motion graphics and color grading.', '3-5 days', 'Film', 250),
('Logo Design', 'Distinctive brand identities that capture your vision.', '3-5 days', 'Palette', 200),
('Ghost Writing', 'Professional ghostwriting for books, articles, and thought leadership.', '5-7 days', 'PenTool', 400),
('Graphic Design', 'Stunning visuals for social media, ads, and marketing materials.', '2-4 days', 'Image', 150),
('Brochure Design', 'Print-ready brochures and catalogs with premium layouts.', '3-5 days', 'BookOpen', 250),
('Event Management', 'End-to-end event planning and digital event solutions.', 'Custom', 'Calendar', 1000),
('Cryptography', 'Security audits, encryption solutions, and blockchain development.', '7-14 days', 'Lock', 2000),
('Comic Creation', 'Original comic art and illustrated storytelling.', '7-10 days', 'BookMarked', 500),
('Filming', 'Professional filming services for commercials and brand content.', '5-7 days', 'Camera', 800),
('Package & Label Design', 'Eye-catching packaging that stands out on shelves.', '4-6 days', 'Package', 300),
('Voice Over', 'Professional voice narration for ads, courses, and media.', '1-3 days', 'Mic', 150),
('UI/UX Designing', 'User-centered interfaces that delight and convert.', '5-10 days', 'Layout', 800),
('AI Automation', 'Automate your business workflows with custom AI agents and integrations.', '14-30 days', 'Cpu', 1200);
