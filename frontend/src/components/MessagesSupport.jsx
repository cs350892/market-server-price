import React, { useState } from 'react';
import { mockMessages } from '../data/mockData';

const MessagesSupport = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [reply, setReply] = useState('');

  const handleReply = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: 'replied' } : msg
    ));
    setReply('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Messages & Support</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        {messages.map(message => (
          <div key={message.id} className="border-b py-2">
            <p><strong>From:</strong> {message.from}</p>
            <p><strong>Subject:</strong> {message.subject}</p>
            <p>{message.message}</p>
            <p><strong>Status:</strong> {message.status}</p>
            <p><strong>Date:</strong> {message.date}</p>
            {message.status === 'unread' && (
              <div className="mt-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleReply(message.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesSupport;