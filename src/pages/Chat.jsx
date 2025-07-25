import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { mockData } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock conversations data
  const mockConversations = [
    {
      _id: 'conv1',
      participant: {
        _id: '1',
        name: 'Sarah Chen',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        text: 'Great session today! The React optimization techniques you showed me were really helpful.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        sender: 'participant'
      },
      unreadCount: 0
    },
    {
      _id: 'conv2',
      participant: {
        _id: '2',
        name: 'David Kumar',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      lastMessage: {
        text: 'I\'ve prepared some system design resources for tomorrow\'s session. Check them out!',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        sender: 'participant'
      },
      unreadCount: 2
    },
    {
      _id: 'conv3',
      participant: {
        _id: '3',
        name: 'Emily Rodriguez',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        text: 'Thanks for the ML deployment guidance!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'me'
      },
      unreadCount: 0
    },
    {
      _id: 'conv4',
      participant: {
        _id: '4',
        name: 'James Patel',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        isOnline: false,
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      lastMessage: {
        text: 'The code review was very insightful. Looking forward to our next session!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        sender: 'me'
      },
      unreadCount: 0
    }
  ];

  // Mock messages for selected conversation
  const mockMessages = {
    'conv1': [
      {
        _id: 'm1',
        text: 'Hi Sarah! Thanks for the amazing React session today.',
        sender: 'me',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm2',
        text: 'You\'re very welcome! I\'m glad you found the optimization techniques helpful. Did you get a chance to try them in your project?',
        sender: 'participant',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm3',
        text: 'Yes! I implemented React.memo and useMemo in my dashboard component and saw a 40% performance improvement!',
        sender: 'me',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm4',
        text: 'That\'s fantastic! 🎉 40% is a significant improvement. You\'re really getting the hang of performance optimization.',
        sender: 'participant',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm5',
        text: 'Great session today! The React optimization techniques you showed me were really helpful.',
        sender: 'participant',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'delivered'
      }
    ],
    'conv2': [
      {
        _id: 'm6',
        text: 'Hi David! Looking forward to our system design session tomorrow.',
        sender: 'me',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm7',
        text: 'Absolutely! I\'ve prepared some great resources on distributed systems and load balancing.',
        sender: 'participant',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'm8',
        text: 'I\'ve prepared some system design resources for tomorrow\'s session. Check them out!',
        sender: 'participant',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'delivered'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation._id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      _id: `m${Date.now()}`,
      text: newMessage.trim(),
      sender: 'me',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m._id === message._id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv._id === selectedConversation._id 
        ? { 
            ...conv, 
            lastMessage: {
              text: message.text,
              timestamp: message.timestamp,
              sender: 'me'
            }
          }
        : conv
    ));

    toast.success('Message sent!');
  };

  const formatMessageTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM dd');
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'delivered': return '✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 pt-16">
      <div className="h-full flex">
        {/* Sidebar - Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Messages</h2>
            
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                    selectedConversation?._id === conversation._id ? 'bg-cyan-500/10 border-r-2 border-r-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={conversation.participant.profileImage}
                        alt={conversation.participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white truncate">
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage.sender === 'me' && 'You: '}
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-cyan-500 text-white text-xs rounded-full min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participant.profileImage}
                      alt={selectedConversation.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-white">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {selectedConversation.participant.isOnline 
                          ? 'Online' 
                          : `Last seen ${formatMessageTime(selectedConversation.participant.lastSeen)}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <PhoneIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <VideoCameraIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        message.sender === 'me' ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`px-4 py-2 rounded-2xl ${
                          message.sender === 'me' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-md'
                            : 'bg-white/10 text-white rounded-bl-md'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
                          message.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.sender === 'me' && (
                            <span className="text-cyan-400">
                              {getMessageStatus(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={!newMessage.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-24 h-24 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
