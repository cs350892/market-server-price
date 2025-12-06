import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MessagesSupport = () => {
  const { apiFetch } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/v1/admin/messages');
        setMessages(res.messages || []);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [apiFetch]);

  const handleReply = async (id) => {
    const replyText = replies[id];
    if (!replyText) return;
    try {
      await apiFetch(`/api/v1/admin/messages/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyText }),
      });
      setMessages(messages.map(msg =>
        (msg._id === id || msg.id === id) ? { ...msg, status: 'replied' } : msg
      ));
      setReplies({ ...replies, [id]: '' });
    } catch (err) {
      setError(err.message);
    }
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
                  className="w-full p-2 border rounded bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
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