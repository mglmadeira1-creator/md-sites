-- Limpar tabelas existentes (Ordem reversa de dependências para evitar erros de chave estrangeira)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.installed_apps CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.domains CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.websites CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Perfis de Utilizadores (Associado ao auth.users do Supabase)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    email text,
    full_name text,
    avatar_url text
);

-- Habilitar RLS nos Perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de perfis" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização do próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente aquando do registo no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilizador Demo'), 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Tabela de Websites
CREATE TABLE public.websites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    palette text NOT NULL,
    features text[] NOT NULL,
    url text UNIQUE NOT NULL,
    status text DEFAULT 'Publicado'::text NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para Websites
CREATE INDEX IF NOT EXISTS idx_websites_url ON public.websites(url);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);

-- RLS nos Websites
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de websites" ON public.websites
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de websites" ON public.websites
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de websites" ON public.websites
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminação de websites" ON public.websites
    FOR DELETE USING (true);


-- 3. Tabela de Páginas do Website (Conteúdo Adicional)
CREATE TABLE public.pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    website_id uuid REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    UNIQUE (website_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_pages_website_id ON public.pages(website_id);

-- RLS nas Páginas
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de páginas" ON public.pages
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de páginas" ON public.pages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de páginas" ON public.pages
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminação de páginas" ON public.pages
    FOR DELETE USING (true);


-- 4. Tabela de Domínios Customizados
CREATE TABLE public.domains (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    website_id uuid REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL UNIQUE,
    domain_name text UNIQUE NOT NULL,
    status text DEFAULT 'Pendente'::text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_domains_name ON public.domains(domain_name);

-- Habilitar RLS nos Domínios
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de domínios" ON public.domains
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de domínios" ON public.domains
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de domínios" ON public.domains
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminação de domínios" ON public.domains
    FOR DELETE USING (true);


-- 5. Tabela de Assets (Logótipos, Imagens, etc.)
CREATE TABLE public.assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    website_id uuid REFERENCES public.websites(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_size integer,
    mime_type text
);

-- RLS nos Assets
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de assets" ON public.assets
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de assets" ON public.assets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir eliminação de assets" ON public.assets
    FOR DELETE USING (true);


-- 6. Tabela de Definições Globais e SEO
CREATE TABLE public.settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    website_id uuid REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL UNIQUE,
    seo_title text,
    seo_description text,
    social_share_image text,
    google_analytics_id text
);

-- RLS nas Definições
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de settings" ON public.settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de settings" ON public.settings
    FOR UPDATE USING (true);


-- 7. Tabela de Aplicações Instaladas no Website (Marketplace)
CREATE TABLE public.installed_apps (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    website_id uuid REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    app_id text NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    UNIQUE (website_id, app_id)
);

CREATE INDEX IF NOT EXISTS idx_installed_apps_website ON public.installed_apps(website_id);

-- RLS nas Apps Instaladas
ALTER TABLE public.installed_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de apps instaladas" ON public.installed_apps
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de apps instaladas" ON public.installed_apps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de apps instaladas" ON public.installed_apps
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminação de apps instaladas" ON public.installed_apps
    FOR DELETE USING (true);
