-- White Elephant Party 2025 - Supabase Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- ============================================
-- TABLE: agents
-- ============================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  real_name TEXT NOT NULL,
  codename TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  wants_reminders BOOLEAN DEFAULT false,
  attendance_status TEXT CHECK (attendance_status IN ('attending', 'not_attending', 'uncertain')),
  guest_count INTEGER DEFAULT 0,
  guest_names TEXT[], -- Array of guest names
  personality_responses JSONB, -- Store personality quiz answers
  conversation_log JSONB, -- Full HQ Terminal chat history
  access_code TEXT DEFAULT 'RED-SLEIGH-2025',
  rsvp_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast codename lookups
CREATE INDEX IF NOT EXISTS idx_agents_codename ON public.agents(codename);
CREATE INDEX IF NOT EXISTS idx_agents_attendance ON public.agents(attendance_status);
CREATE INDEX IF NOT EXISTS idx_agents_created ON public.agents(created_at DESC);

-- ============================================
-- TABLE: ai_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  messages JSONB NOT NULL, -- Array of chat messages
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for agent session lookups
CREATE INDEX IF NOT EXISTS idx_ai_sessions_agent ON public.ai_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_created ON public.ai_sessions(created_at DESC);

-- ============================================
-- TABLE: transmissions
-- ============================================
CREATE TABLE IF NOT EXISTS public.transmissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  requires_response BOOLEAN DEFAULT false,
  response_prompt TEXT, -- Optional prompt for user response (e.g., "Reply with your favorite gift idea")
  response_type TEXT CHECK (response_type IN ('text', 'choice', 'none')) DEFAULT 'none',
  response_options JSONB, -- For choice type: ["Option A", "Option B", "Option C"]
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Index for active transmissions
CREATE INDEX IF NOT EXISTS idx_transmissions_active ON public.transmissions(is_active, created_at DESC);

-- ============================================
-- TABLE: transmission_responses
-- ============================================
CREATE TABLE IF NOT EXISTS public.transmission_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transmission_id UUID REFERENCES public.transmissions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transmission_id, agent_id) -- One response per agent per transmission
);

-- Index for responses
CREATE INDEX IF NOT EXISTS idx_responses_transmission ON public.transmission_responses(transmission_id);
CREATE INDEX IF NOT EXISTS idx_responses_agent ON public.transmission_responses(agent_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transmission_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read agents (for roster)
CREATE POLICY "Anyone can view agents"
  ON public.agents
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert agents (for registration)
CREATE POLICY "Anyone can create agents"
  ON public.agents
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update their own agent data
CREATE POLICY "Anyone can update agents"
  ON public.agents
  FOR UPDATE
  USING (true);

-- Policy: Anyone can read AI sessions
CREATE POLICY "Anyone can view AI sessions"
  ON public.ai_sessions
  FOR SELECT
  USING (true);

-- Policy: Anyone can create AI sessions
CREATE POLICY "Anyone can create AI sessions"
  ON public.ai_sessions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can read active transmissions
CREATE POLICY "Anyone can view active transmissions"
  ON public.transmissions
  FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated users can create transmissions (admin only)
CREATE POLICY "Only authenticated users can create transmissions"
  ON public.transmissions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anyone can read transmission responses
CREATE POLICY "Anyone can view transmission responses"
  ON public.transmission_responses
  FOR SELECT
  USING (true);

-- Policy: Anyone can create transmission responses
CREATE POLICY "Anyone can create transmission responses"
  ON public.transmission_responses
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for agents table
DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a sample transmission
INSERT INTO public.transmissions (message, priority, created_by)
VALUES 
  ('🎯 OPERATION SANTA''S MANIFEST is now ACTIVE. All agents report to HQ for briefing.', 'high', 'HQ'),
  ('🎁 Reminder: Gift budget is $25-$50. No exceptions, agents!', 'medium', 'HQ')
ON CONFLICT DO NOTHING;

-- Insert a sample interactive transmission
INSERT INTO public.transmissions (
  message, 
  priority, 
  created_by, 
  requires_response, 
  response_prompt,
  response_type,
  response_options
)
VALUES (
  '🎄 MISSION INTEL NEEDED: HQ is gathering gift ideas. What''s your best White Elephant gift suggestion?',
  'medium',
  'HQ',
  true,
  'Share your gift idea (budget: $25-50)',
  'text',
  NULL
)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these after schema creation to verify everything works:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('agents', 'ai_sessions', 'transmissions');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('agents', 'ai_sessions', 'transmissions');

-- View all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- MIGRATION: Add reminder fields (Run this if upgrading existing database)
-- ============================================

-- Add wants_reminders column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'agents' 
    AND column_name = 'wants_reminders'
  ) THEN
    ALTER TABLE public.agents ADD COLUMN wants_reminders BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add interactive transmission columns if they don't exist
DO $$ 
BEGIN
  -- requires_response
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transmissions' 
    AND column_name = 'requires_response'
  ) THEN
    ALTER TABLE public.transmissions ADD COLUMN requires_response BOOLEAN DEFAULT false;
  END IF;
  
  -- response_prompt
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transmissions' 
    AND column_name = 'response_prompt'
  ) THEN
    ALTER TABLE public.transmissions ADD COLUMN response_prompt TEXT;
  END IF;
  
  -- response_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transmissions' 
    AND column_name = 'response_type'
  ) THEN
    ALTER TABLE public.transmissions ADD COLUMN response_type TEXT DEFAULT 'none';
    ALTER TABLE public.transmissions ADD CONSTRAINT transmissions_response_type_check 
      CHECK (response_type IN ('text', 'choice', 'none'));
  END IF;
  
  -- response_options
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transmissions' 
    AND column_name = 'response_options'
  ) THEN
    ALTER TABLE public.transmissions ADD COLUMN response_options JSONB;
  END IF;
END $$;

-- Create transmission_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transmission_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transmission_id UUID REFERENCES public.transmissions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transmission_id, agent_id)
);

CREATE INDEX IF NOT EXISTS idx_responses_transmission ON public.transmission_responses(transmission_id);
CREATE INDEX IF NOT EXISTS idx_responses_agent ON public.transmission_responses(agent_id);

-- Enable RLS on transmission_responses if not already enabled
ALTER TABLE public.transmission_responses ENABLE ROW LEVEL SECURITY;

-- Add policies for transmission_responses if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'transmission_responses' 
    AND policyname = 'Anyone can view transmission responses'
  ) THEN
    CREATE POLICY "Anyone can view transmission responses"
      ON public.transmission_responses
      FOR SELECT
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'transmission_responses' 
    AND policyname = 'Anyone can create transmission responses'
  ) THEN
    CREATE POLICY "Anyone can create transmission responses"
      ON public.transmission_responses
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Verify new columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'agents'
  AND column_name IN ('email', 'phone', 'wants_reminders')
ORDER BY column_name;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transmissions'
  AND column_name IN ('requires_response', 'response_prompt', 'response_type', 'response_options')
ORDER BY column_name;

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================

/*
1. Go to Supabase Dashboard → SQL Editor
2. Create new query and paste this entire file
3. Click "Run" to execute
4. Verify tables created successfully
5. Test with a sample insert:

INSERT INTO public.agents (real_name, codename, attendance_status)
VALUES ('Test Agent', 'JOLLY-BOOTS', 'attending')
RETURNING *;

6. If successful, delete test data:

DELETE FROM public.agents WHERE codename = 'JOLLY-BOOTS';

*/
