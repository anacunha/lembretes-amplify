import './App.css'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {

  const client = generateClient<Schema>()
  const { user, signOut } = useAuthenticator();

  const [lembretes, setLembretes] = useState<Schema["Lembrete"]["type"][]>([]);

  useEffect(() => {
    const sub = client.models.Lembrete.observeQuery().subscribe({
      next: ({ items }) => {
        setLembretes([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const criarLembrete = async () => {
    await client.models.Lembrete.create({
      conteudo: window.prompt("Qual seu lembrete?"),
      feito: false
    })
  };

  function apagarLembrete(id: string) {
    client.models.Lembrete.delete({ id })
  };

  return (
    <>
      <div>
        <h1>Lembretes de {user?.signInDetails?.loginId}</h1>
        <button onClick={signOut}>Sair</button>
        <ul>
          {lembretes.map(lembrete => (
            <li
              key={lembrete.id}
              onClick={() => apagarLembrete(lembrete.id)}
            >
                {lembrete.conteudo}
            </li>
          ))}
        </ul>
        <button onClick={criarLembrete}>Novo lembrete</button>
      </div>
    </>
  )
}

export default App
