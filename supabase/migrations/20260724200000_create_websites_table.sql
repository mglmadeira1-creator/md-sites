-- Criar tabela de websites
CREATE TABLE IF NOT EXISTS public.websites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    palette text NOT NULL,
    features text[] NOT NULL,
    url text UNIQUE NOT NULL,
    domain text DEFAULT 'Nenhum'::text NOT NULL,
    status text DEFAULT 'Publicado'::text NOT NULL,
    user_id uuid DEFAULT auth.uid()
);

-- Ativar segurança RLS (Row Level Security)
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança RLS
-- 1. Leitura: Qualquer pessoa pode ver os websites (necessário para os subdomínios públicos)
CREATE POLICY "Permitir leitura pública de websites" ON public.websites
    FOR SELECT USING (true);

-- 2. Inserção: Utilizadores podem criar websites (se logados, associa-se ao user_id, senão fica null)
CREATE POLICY "Permitir inserção de websites" ON public.websites
    FOR INSERT WITH CHECK (true);

-- 3. Atualização: Utilizadores podem atualizar os seus próprios websites (ou todos no caso de modo demo anon)
CREATE POLICY "Permitir atualização de websites" ON public.websites
    FOR UPDATE USING (true);

-- 4. Eliminação: Utilizadores podem apagar websites
CREATE POLICY "Permitir eliminação de websites" ON public.websites
    FOR DELETE USING (true);
