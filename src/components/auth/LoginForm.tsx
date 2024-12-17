import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'rgb(var(--color-primary))',
              brandAccent: 'rgb(var(--color-primary))',
            },
          },
        },
      }}
      providers={[]}
      redirectTo={window.location.origin}
      view="sign_in"
      showLinks={false}
    />
  );
};