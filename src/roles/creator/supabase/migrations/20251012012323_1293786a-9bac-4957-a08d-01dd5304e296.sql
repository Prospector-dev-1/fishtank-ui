-- Create thoughts table for community posts
CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create thought_likes table
CREATE TABLE public.thought_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(thought_id, user_id)
);

-- Create thought_comments table
CREATE TABLE public.thought_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for thoughts
CREATE POLICY "Thoughts are viewable by everyone"
  ON public.thoughts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create thoughts"
  ON public.thoughts FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own thoughts"
  ON public.thoughts FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own thoughts"
  ON public.thoughts FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies for thought_likes
CREATE POLICY "Likes are viewable by everyone"
  ON public.thought_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like thoughts"
  ON public.thought_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike thoughts"
  ON public.thought_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for thought_comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.thought_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.thought_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.thought_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updating thoughts updated_at
CREATE TRIGGER update_thoughts_updated_at
  BEFORE UPDATE ON public.thoughts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();