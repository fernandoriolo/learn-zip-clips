-- Create storage buckets for videos and zip files
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('videos', 'videos', true),
  ('zip-files', 'zip-files', true),
  ('thumbnails', 'thumbnails', true);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  zip_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can view)
CREATE POLICY "Anyone can view tutorials" 
ON public.tutorials 
FOR SELECT 
USING (true);

-- Create policies for insert (anyone can create for now)
CREATE POLICY "Anyone can create tutorials" 
ON public.tutorials 
FOR INSERT 
WITH CHECK (true);

-- Create policies for update
CREATE POLICY "Anyone can update tutorials" 
ON public.tutorials 
FOR UPDATE 
USING (true);

-- Create policies for delete
CREATE POLICY "Anyone can delete tutorials" 
ON public.tutorials 
FOR DELETE 
USING (true);

-- Storage policies for videos bucket
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');

-- Storage policies for zip-files bucket
CREATE POLICY "Anyone can view zip files"
ON storage.objects FOR SELECT
USING (bucket_id = 'zip-files');

CREATE POLICY "Anyone can upload zip files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'zip-files');

CREATE POLICY "Anyone can delete zip files"
ON storage.objects FOR DELETE
USING (bucket_id = 'zip-files');

-- Storage policies for thumbnails bucket
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Anyone can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Anyone can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tutorials_updated_at
BEFORE UPDATE ON public.tutorials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();