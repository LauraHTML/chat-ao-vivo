'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !username.trim()) return;

    socket.emit('send-message', {
      user: username,
      message: inputMessage
    });

    setInputMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat em Tempo Real</h1>
      
      {!username ? (
        <div>
          <input
            type="text"
            placeholder="Digite seu nome..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') setUsername(e.target.value);
            }}
          />
        </div>
      ) : (
        <>
          <div style={{ 
            height: '400px', 
            border: '1px solid #ccc', 
            overflowY: 'scroll',
            marginBottom: '10px',
            padding: '10px'
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: '10px' }}>
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{ width: '80%', padding: '10px' }}
            />
            <button type="submit" style={{ width: '18%', padding: '10px' }}>
              Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
}