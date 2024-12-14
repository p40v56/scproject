import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(supabaseUrl, serviceRoleKey)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, userId } = await req.json()
    const authClient = supabase.auth.admin

    // Vérifier que l'utilisateur qui fait la requête est un admin
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('No authorization token')
    }

    const { data: { user: caller } } = await supabase.auth.getUser(token)
    if (!caller) {
      throw new Error('Invalid token')
    }

    // Vérifier que l'appelant est un admin
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', caller.id)
      .single()

    if (!callerProfile?.roles?.includes('admin')) {
      throw new Error('Unauthorized - Admin only')
    }

    let result
    switch (action) {
      case 'disable':
        result = await authClient.updateUserById(userId, {
          user_metadata: { disabled: true }
        })
        break
      case 'delete':
        result = await authClient.deleteUser(userId)
        break
      case 'sendMagicLink':
        const { data: userEmail } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single()
        
        if (!userEmail?.email) {
          throw new Error('User email not found')
        }
        
        result = await authClient.generateLink({
          email: userEmail.email,
          type: 'magiclink'
        })
        break
      default:
        throw new Error('Invalid action')
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})