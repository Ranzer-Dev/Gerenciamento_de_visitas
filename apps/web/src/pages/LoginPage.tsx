import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { TEXTS } from '@/lib/constants';
import { api } from '@/lib/axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    try {
      if (isRegister) {
        await api.post('/register', { name, email, password });
        alert('Cadastro realizado! Faça login.');
        setIsRegister(false);
      } else {
        const res = await api.post('/login', { email, password });
        signIn(res.data.token, res.data.user);
      }
    } catch (error) {
      console.error(error);
      alert('Erro na autenticação. Verifique os dados.');
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isRegister ? "Novo Cadastro" : TEXTS.LOGIN.TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
               <Input placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} />
            )}
            <Input placeholder={TEXTS.LOGIN.EMAIL_LABEL} value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder={TEXTS.LOGIN.PASS_LABEL} value={password} onChange={e => setPassword(e.target.value)} />
            
            <Button className="w-full" type="submit">
              {isRegister ? "Cadastrar" : TEXTS.LOGIN.BUTTON}
            </Button>
          </form>

          <div className="text-center text-sm text-blue-600 cursor-pointer mt-4" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Já tenho conta" : TEXTS.LOGIN.REGISTER_LINK}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}