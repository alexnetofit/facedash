import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const FB_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1067415587608867';
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'b61f6ae969765a035c2c8b65196f2c86';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 400 }
      );
    }

    // Verificar o token com o Facebook
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${FB_APP_ID}|${FB_APP_SECRET}`
    );

    const tokenData = await response.json();

    if (!tokenData.data?.is_valid) {
      return NextResponse.json(
        { error: 'Token de acesso inválido' },
        { status: 400 }
      );
    }

    // Obter informações do usuário do Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`
    );

    const userData = await userResponse.json();

    if (!userData.id) {
      return NextResponse.json(
        { error: 'Não foi possível obter informações do usuário' },
        { status: 400 }
      );
    }

    // Verificar se o usuário está autenticado no Supabase
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knvlgtinmoyucxpsmsqr.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudmxndGlubW95dWN4cHNtc3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDY0MTMsImV4cCI6MjA2MTcyMjQxM30.Axch5D6cueH3-dlh1Ha5EL1Y3qVE7gUwlGFAa-eF_cA',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Atualizar informações do usuário no Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        facebook_user_id: userData.id,
        facebook_access_token: accessToken,
      })
      .eq('id', session.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar informações do usuário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      facebookUserId: userData.id,
    });
  } catch (error) {
    console.error('Erro na rota de autenticação do Facebook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
} 