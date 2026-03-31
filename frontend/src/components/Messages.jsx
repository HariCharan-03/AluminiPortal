import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function Messages({ currentUser, alumni }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [thread, setThread] = useState([]);
  const [input, setInput] = useState('');
  const [isReferral, setIsReferral] = useState(false);
  const [sending, setSending] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const bottomRef = useRef(null);

  // Load inbox on mount
  useEffect(() => {
    fetchInbox();
  }, []);

  // Load thread when contact selected
  useEffect(() => {
    if (selectedContact) fetchThread(selectedContact);
  }, [selectedContact]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const fetchInbox = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/messages/${currentUser}`);
      if (res.data.success) setInbox(res.data.data);
    } catch {}
  };

  const fetchThread = async (contact) => {
    try {
      const res = await axios.get(`http://localhost:3000/messages/conversation/${currentUser}/${contact}`);
      if (res.data.success) setThread(res.data.data);
    } catch {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedContact) return;
    setSending(true);
    try {
      const res = await axios.post('http://localhost:3000/send-message', {
        sender: currentUser,
        receiver: selectedContact,
        message: input.trim(),
        is_referral: isReferral,
      });
      if (res.data.success) {
        setInput('');
        setIsReferral(false);
        await fetchThread(selectedContact);
        await fetchInbox();
        if (isReferral) toast.success('Referral request sent! 🚀');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const allContacts = [
    ...new Set([
      ...inbox.map((i) => i.contact),
      ...alumni.filter((a) => a.name !== currentUser).map((a) => a.name),
    ]),
  ].filter((c) => c.toLowerCase().includes(contactSearch.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-indigo-400 text-sm">Chat with alumni, ask for referrals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: '520px' }}>
        {/* Contact list */}
        <div className="glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-white text-sm font-semibold mb-2">Alumni</p>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search alumni..."
                className="input-glass w-full rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-indigo-500 focus:ring-0"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {allContacts.length === 0 && (
              <p className="text-indigo-400 text-xs text-center mt-8 px-4">
                No alumni to message yet. Add some first!
              </p>
            )}
            {allContacts.map((contact) => (
              <button
                key={contact}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  selectedContact === contact ? '' : 'hover:bg-white/5'
                }`}
                style={selectedContact === contact ? {
                  background: 'rgba(99,102,241,0.2)',
                  borderRight: '2px solid #6366f1'
                } : {}}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {contact.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{contact}</p>
                  <p className="text-indigo-400 text-xs">alumni</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 glass rounded-2xl flex flex-col overflow-hidden">
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(99,102,241,0.15)' }}>
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-1">Select a contact</p>
              <p className="text-indigo-400 text-sm">Choose an alumnus to chat with or ask for a referral</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-4 flex items-center gap-3 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {selectedContact.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{selectedContact}</p>
                  <p className="text-indigo-400 text-xs">Alumni</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.length === 0 && (
                  <p className="text-indigo-400 text-xs text-center mt-8">
                    No messages yet. Say hi! 👋
                  </p>
                )}
                {thread.map((msg) => {
                  const isMine = msg.sender === currentUser;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2.5 rounded-2xl ${isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                        style={{
                          background: isMine
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : 'rgba(255,255,255,0.08)',
                        }}>
                        {msg.is_referral === 1 && (
                          <div className="text-xs font-bold mb-1 text-yellow-300">🚀 Referral Request</div>
                        )}
                        <p className="text-white text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-indigo-200' : 'text-indigo-400'}`}>
                          {formatTime(msg.sent_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="referral-check"
                    checked={isReferral}
                    onChange={(e) => setIsReferral(e.target.checked)}
                    className="accent-yellow-400 w-3.5 h-3.5"
                  />
                  <label htmlFor="referral-check" className="text-yellow-300 text-xs cursor-pointer">
                    🚀 Mark as referral request
                  </label>
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="input-glass flex-1 rounded-xl px-4 py-2.5 text-white text-sm placeholder-indigo-500 focus:ring-0"
                  />
                  <button type="submit" disabled={sending || !input.trim()}
                    className="btn-primary px-4 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 flex items-center gap-1.5">
                    {sending ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
