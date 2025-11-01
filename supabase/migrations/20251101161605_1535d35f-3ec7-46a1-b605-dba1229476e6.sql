-- Create posts table to store link collections
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create links table to store individual links within posts
CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  button_name text NOT NULL,
  url text NOT NULL,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT max_links_per_post CHECK (position >= 0 AND position < 20)
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Users can view their own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view any post
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

-- Links policies
CREATE POLICY "Users can view links of their own posts"
  ON public.links FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = links.post_id
    AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create links for their own posts"
  ON public.links FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = links.post_id
    AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update links of their own posts"
  ON public.links FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = links.post_id
    AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete links of their own posts"
  ON public.links FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = links.post_id
    AND posts.user_id = auth.uid()
  ));

-- Public can view links of any post
CREATE POLICY "Anyone can view links"
  ON public.links FOR SELECT
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for better performance
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_links_post_id ON public.links(post_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);