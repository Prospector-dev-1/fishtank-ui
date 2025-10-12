-- Create thoughts table for Twitter-like posts
CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;

-- Create policies for thoughts
CREATE POLICY "Thoughts are viewable by everyone" 
ON public.thoughts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own thoughts" 
ON public.thoughts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts" 
ON public.thoughts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thoughts" 
ON public.thoughts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_thoughts_updated_at
BEFORE UPDATE ON public.thoughts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create thought_likes table for tracking likes
CREATE TABLE public.thought_likes (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  thought_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(thought_id, user_id)
);

-- Enable RLS on thought_likes
ALTER TABLE public.thought_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for thought_likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.thought_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like thoughts" 
ON public.thought_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike thoughts" 
ON public.thought_likes 
FOR DELETE 
USING (auth.uid() = user_id);