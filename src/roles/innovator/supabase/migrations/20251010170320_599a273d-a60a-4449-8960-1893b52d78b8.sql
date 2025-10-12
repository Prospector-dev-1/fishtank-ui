-- Create thought_comments table
CREATE TABLE public.thought_comments (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.thought_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for thought_comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.thought_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.thought_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.thought_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.thought_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_thought_comments_updated_at
BEFORE UPDATE ON public.thought_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster comment queries
CREATE INDEX idx_thought_comments_thought_id ON public.thought_comments(thought_id);
CREATE INDEX idx_thought_comments_created_at ON public.thought_comments(created_at DESC);