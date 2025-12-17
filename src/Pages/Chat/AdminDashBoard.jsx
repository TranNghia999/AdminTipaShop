import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';
import { Send, User, Shield, Circle, X, Users, Image, Loader, MessageSquare, Search, Clock, ArrowLeft, Menu } from 'lucide-react';
import { MyContext } from '../../App';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dw28j9x8v/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = 'present_upload_image_chat';
const WS_URL = 'wss://tipashopbackend.duckdns.org/ws-chat';
const MAX_FILES = 5;

const nowIso = () => new Date().toISOString();
const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const AdminDashboard = () => {
    const context = useContext(MyContext);
    
    // State
    const [adminId, setAdminId] = useState('');
    const [adminName, setAdminName] = useState('');
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true); // For mobile toggle

    // Refs
    const wsRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isConnectingRef = useRef(false);
    const reconnectTimerRef = useRef(null);

    // Initialize adminId and adminName from context
    useEffect(() => {
        if (context?.userData?._id) {
            setAdminId(context.userData._id);
            console.log('✅ AdminId set:', context.userData._id);
        }
        if (context?.userData?.name) {
            setAdminName(context.userData.name);
            console.log('✅ AdminName set:', context.userData.name);
        }
    }, [context?.userData?._id, context?.userData?.name]);

    // Handle responsive - hide sidebar when room selected on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowSidebar(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll to bottom when messages change
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedRoom, scrollToBottom]);

    // Filter rooms by search query
    const filteredRooms = useMemo(() => {
        if (!searchQuery.trim()) return userRooms;
        const query = searchQuery.toLowerCase();
        return userRooms.filter(room =>
            room.userName?.toLowerCase().includes(query) ||
            room.lastMessage?.toLowerCase().includes(query)
        );
    }, [userRooms, searchQuery]);

    // WebSocket connection
    const connectWebSocket = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log('⚠️ WebSocket already connected');
            return;
        }

        if (isConnectingRef.current) {
            console.log('⚠️ Already connecting...');
            return;
        }

        if (!adminId) {
            console.log('⚠️ adminId not ready, waiting...');
            return;
        }

        isConnectingRef.current = true;
        console.log('🔌 Connecting to WebSocket...', { adminId, adminName });

        try {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('%c[ADMIN] WebSocket CONNECTED', 'color: green; font-weight: bold;');
                setConnected(true);
                isConnectingRef.current = false;

                const subscribeMsg = {
                    type: 'SUBSCRIBE',
                    userId: adminId,
                    sender: adminName || 'Admin',
                    senderType: 'ADMIN',
                    roomId: 'admin_lobby',
                    timestamp: nowIso(),
                };

                console.log('%c[ADMIN] Sending SUBSCRIBE:', 'color: orange; font-weight: bold;', subscribeMsg);
                ws.send(JSON.stringify(subscribeMsg));
            };

            ws.onmessage = (ev) => {
                try {
                    const data = JSON.parse(ev.data);
                    console.log('%c[ADMIN] Received:', 'color: blue;', data.type, data);

                    switch (data.type) {
                        case 'SUBSCRIBE':
                            console.log('✅ Subscribed successfully');
                            setIsSubscribed(true);
                            break;
                        case 'CHAT_MESSAGE':
                            handleChatMessage(data);
                            break;
                        case 'MESSAGE_HISTORY':
                            handleMessageHistory(data);
                            break;
                        case 'TYPING':
                            handleTypingEvent(data);
                            break;
                        case 'USER_JOINED':
                            handleUserJoined(data);
                            break;
                        case 'ROOM_LIST':
                            handleRoomList(data);
                            break;
                        default:
                            console.warn('⚠️ Unknown message type:', data.type);
                    }
                } catch (err) {
                    console.error('❌ Parse error:', err);
                }
            };

            ws.onerror = (err) => {
                console.error('❌ WebSocket error:', err);
                setConnected(false);
                isConnectingRef.current = false;
            };

            ws.onclose = (ev) => {
                console.log('🔌 WebSocket closed:', ev.code, ev.reason);
                setConnected(false);
                setIsSubscribed(false);
                isConnectingRef.current = false;
                wsRef.current = null;

                if (ev.code !== 1000) {
                    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = setTimeout(() => {
                        console.log('🔄 Reconnecting...');
                        connectWebSocket();
                    }, 3000);
                }
            };
        } catch (err) {
            console.error('❌ Connection error:', err);
            isConnectingRef.current = false;
        }
    }, [adminId, adminName]);

    // Message handlers
    const handleChatMessage = useCallback((data) => {
        setTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setMessages((prev) => {
            const exists = prev.some(m =>
                m.userId === data.userId &&
                m.timestamp === data.timestamp &&
                m.content === data.content
            );
            if (exists) return prev;

            return [...prev, {
                id: `${Date.now()}_${Math.random()}`,
                sender: data.sender,
                senderType: data.senderType,
                content: data.content,
                images: data.images,
                timestamp: data.timestamp || nowIso(),
                userId: data.userId,
                roomId: data.roomId,
            }];
        });

        setUserRooms(prev => prev.map(room => {
            if (room.roomId === data.roomId) {
                const isCurrentRoom = selectedRoom === data.roomId;
                return {
                    ...room,
                    lastMessage: data.content || '[Image]',
                    timestamp: data.timestamp,
                    unreadCount: isCurrentRoom ? 0 : (room.unreadCount || 0) + 1,
                };
            }
            return room;
        }));
    }, [selectedRoom]);

    const handleMessageHistory = useCallback((data) => {
        if (data.messageHistory && Array.isArray(data.messageHistory)) {
            setMessages((prev) => {
                const otherRoomMessages = prev.filter(m => m.roomId !== data.roomId);
                const historyMessages = data.messageHistory.map(msg => ({
                    id: `${msg.timestamp}_${msg.userId}_${Math.random()}`,
                    sender: msg.sender,
                    senderType: msg.senderType,
                    content: msg.content,
                    images: msg.images,
                    timestamp: msg.timestamp,
                    userId: msg.userId,
                    roomId: msg.roomId,
                }));
                return [...otherRoomMessages, ...historyMessages];
            });
        }
    }, []);

    const handleTypingEvent = useCallback((data) => {
        if (data.userId !== adminId && data.roomId === selectedRoom) {
            setTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
        }
    }, [adminId, selectedRoom]);

    const handleUserJoined = useCallback((data) => {
        if (data.senderType === 'USER' && data.userId !== adminId) {
            setUserRooms((prev) => {
                const exists = prev.some(r => r.roomId === data.roomId);
                if (exists) return prev;
                return [...prev, {
                    roomId: data.roomId,
                    userId: data.userId,
                    userName: data.sender,
                    lastMessage: 'User joined',
                    timestamp: data.timestamp,
                    unreadCount: 1,
                }];
            });
        }
    }, [adminId]);

    const handleRoomList = useCallback((data) => {
        if (Array.isArray(data.rooms)) {
            setUserRooms(data.rooms);
        }
    }, []);

    // Connect WebSocket when adminId is ready
    useEffect(() => {
        if (adminId && adminName) {
            connectWebSocket();
        }
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [adminId, adminName, connectWebSocket]);

    // Subscribe to room when selectedRoom changes
    useEffect(() => {
        if (!selectedRoom || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const subscribeMsg = {
            type: 'SUBSCRIBE',
            userId: adminId,
            sender: adminName || 'Admin',
            senderType: 'ADMIN',
            roomId: selectedRoom,
            timestamp: nowIso(),
        };

        try {
            wsRef.current.send(JSON.stringify(subscribeMsg));
        } catch (e) {
            console.error('❌ Subscribe failed:', e);
        }
    }, [selectedRoom, adminId, adminName]);

    // Cloudinary upload
    const uploadToCloudinary = async (file) => {
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        return res.json();
    };

    const uploadSelectedImages = async () => {
        if (!selectedFiles.length) return [];
        setUploading(true);
        try {
            const results = await Promise.all(selectedFiles.map(f => uploadToCloudinary(f)));
            setUploading(false);
            setSelectedFiles([]);
            setPreviews([]);
            return results;
        } catch (err) {
            setUploading(false);
            throw err;
        }
    };

    // File handling
    useEffect(() => {
        if (!selectedFiles.length) {
            setPreviews([]);
            return;
        }
        const files = selectedFiles.slice(0, MAX_FILES);
        const out = [];
        files.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                out[idx] = reader.result;
                if (out.filter(Boolean).length === files.length) {
                    setPreviews(out);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [selectedFiles]);

    const handleSelectFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files.slice(0, MAX_FILES));
    };

    // Send message
    const sendMessage = async () => {
        if ((!input || !input.trim()) && !selectedFiles.length) return;

        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            alert('Mất kết nối. Đang thử kết nối lại...');
            connectWebSocket();
            return;
        }

        if (!selectedRoom) {
            alert('Vui lòng chọn người dùng để chat');
            return;
        }

        let imagesMeta = [];
        if (selectedFiles.length > 0) {
            try {
                imagesMeta = await uploadSelectedImages();
            } catch (err) {
                alert('Tải ảnh thất bại.');
                return;
            }
        }

        const payload = {
            type: 'CHAT_MESSAGE',
            content: input?.trim() || null,
            sender: adminName || 'Admin',
            userId: adminId,
            senderType: 'ADMIN',
            roomId: selectedRoom,
            timestamp: nowIso(),
            images: imagesMeta.length ? imagesMeta : null,
            msgType: imagesMeta.length ? 'IMAGE' : 'TEXT',
        };

        try {
            wsRef.current.send(JSON.stringify(payload));
            setInput('');
            setSelectedFiles([]);
            setPreviews([]);
        } catch (err) {
            alert('Gửi thất bại: ' + err.message);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && selectedRoom) {
            const typeMsg = {
                type: 'TYPING',
                userId: adminId,
                sender: adminName || 'Admin',
                senderType: 'ADMIN',
                roomId: selectedRoom,
            };
            try {
                wsRef.current.send(JSON.stringify(typeMsg));
            } catch (e) { /* ignore */ }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room.roomId);
        setUserRooms(prev => prev.map(r =>
            r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r
        ));
        // Hide sidebar on mobile when room selected
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedRoom(null);
    };

    // Render
    return (
        <div className="flex fixed inset-0 md:relative md:h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar - Room List */}
            <div className={`
                fixed md:relative
                inset-y-0 left-0
                z-30
                w-full md:w-80 lg:w-96
                bg-white border-r border-gray-200
                flex flex-col shadow-lg
                transition-transform duration-300 ease-in-out
                ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                `}>
                {/* Sidebar Header */}
                <div className="p-3 md:p-5 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                                <Shield className="w-5 h-5 md:w-7 md:h-7 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-base md:text-lg truncate max-w-[150px] md:max-w-[200px]">
                                    {adminName || 'Admin'}
                                </h2>
                                <div className="flex items-center gap-2 text-xs md:text-sm">
                                    <Circle className={`w-2 h-2 ${connected ? 'fill-green-400 text-green-400' : 'fill-red-400 text-red-400'}`} />
                                    <span className="text-purple-100">
                                        {connected ? (isSubscribed ? 'Online' : 'Connecting...') : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:bg-white/20 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Room List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.length === 0 ? (
                        <div className="p-6 md:p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium text-sm md:text-base">Chưa có người dùng</p>
                            <p className="text-xs md:text-sm mt-1">Người dùng sẽ xuất hiện khi họ bắt đầu chat</p>
                        </div>
                    ) : (
                        filteredRooms
                            .sort((a, b) => {
                                if ((a.unreadCount || 0) > 0 && (b.unreadCount || 0) === 0) return -1;
                                if ((a.unreadCount || 0) === 0 && (b.unreadCount || 0) > 0) return 1;
                                const timeA = a.timestamp ? new Date(a.timestamp) : new Date(0);
                                const timeB = b.timestamp ? new Date(b.timestamp) : new Date(0);
                                return timeB - timeA;
                            })
                            .map((room) => (
                                <button
                                    key={room.roomId}
                                    onClick={() => handleSelectRoom(room)}
                                    className={`w-full p-3 md:p-4 border-b border-gray-100 hover:bg-purple-50 text-left transition-all active:bg-purple-100 ${
                                        selectedRoom === room.roomId ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center relative flex-shrink-0 shadow-md">
                                            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                            {room.unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[22px] h-[18px] md:h-[22px] bg-red-500 text-white text-[10px] md:text-xs rounded-full flex items-center justify-center font-bold px-1 shadow-lg">
                                                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-semibold truncate text-base md:text-lg ${
                                                    room.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                    {room.userName}
                                                </h3>
                                                {room.timestamp && (
                                                    <span className="text-[10px] md:text-xs text-gray-400 ml-2 flex-shrink-0 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 hidden md:block" />
                                                        {formatTime(room.timestamp)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm md:text-base truncate ${
                                                room.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                                            }`}>
                                                {room.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`
                flex-1 flex flex-col bg-white
                ${showSidebar ? 'hidden md:flex' : 'flex'}
                `}>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-3 md:p-5 shadow-sm">
                    {selectedRoom ? (
                        <div className="flex items-center gap-3">
                            {/* Back button - mobile only */}
                            <button 
                                onClick={handleBackToList}
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-md">
                                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base md:text-lg font-bold text-gray-800 truncate">
                                    {userRooms.find(r => r.roomId === selectedRoom)?.userName || 'Chat'}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-500">
                                    {typing ? 'Đang nhập...' : 'Active now'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-gray-400">
                            {/* Menu button - mobile only */}
                            <button 
                                onClick={() => setShowSidebar(true)}
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
                            <h2 className="text-sm md:text-lg font-semibold">Chọn người dùng để chat</h2>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 overscroll-contain bg-gradient-to-b from-gray-50 to-white">
                    {selectedRoom ? (
                        <>
                            {messages.filter(m => m.roomId === selectedRoom).length === 0 ? (
                                <div className="text-center py-12 md:py-20">
                                    <MessageSquare className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 text-base md:text-lg">Chưa có tin nhắn</p>
                                    <p className="text-gray-400 text-xs md:text-sm mt-2">Gửi tin nhắn để bắt đầu</p>
                                </div>
                            ) : (
                                <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
                                    {messages.filter(m => m.roomId === selectedRoom).map((msg) => {
                                        const isOwn = msg.userId === adminId;
                                        return (
                                            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex gap-2 md:gap-3 max-w-[85%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                                                        msg.senderType === 'ADMIN'
                                                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                            : 'bg-gradient-to-br from-blue-400 to-cyan-400'
                                                    }`}>
                                                        {msg.senderType === 'ADMIN' ?
                                                            <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" /> :
                                                            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                        }
                                                    </div>
                                                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                                        {!isOwn && (
                                                            <span className="text-[10px] md:text-xs text-gray-500 mb-1 px-2 font-medium">
                                                                {msg.sender}
                                                            </span>
                                                        )}
                                                        <div className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-sm ${
                                                            isOwn
                                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                                        }`}>
                                                            {msg.content && <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                                                            {msg.images && msg.images.length > 0 && (
                                                                <div className={`${msg.content ? 'mt-2' : ''} grid gap-2`}>
                                                                    {msg.images.map((img, idx) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={img.secure_url || img.url}
                                                                            alt="shared"
                                                                            className="rounded-lg max-w-[180px] md:max-w-[250px] cursor-pointer hover:opacity-90 transition-opacity"
                                                                            onClick={() => window.open(img.secure_url || img.url, '_blank')}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] md:text-xs text-gray-400 mt-1 px-2">
                                                            {formatTime(msg.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {typing && (
                                        <div className="flex">
                                            <div className="flex gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-md">
                                                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                </div>
                                                <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-sm">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center px-4">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5">
                                    <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />
                                </div>
                                <p className="text-gray-500 text-lg md:text-xl font-medium">Chọn người dùng để chat</p>
                                <p className="text-gray-400 text-xs md:text-sm mt-2">Danh sách người dùng ở bên trái</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {selectedRoom && (
                    <div className="bg-white border-t border-gray-200 p-3 md:p-5 shadow-lg">
                        <div className="max-w-4xl mx-auto">
                            {previews.length > 0 && (
                                <div className="mb-3 flex gap-2 flex-wrap">
                                    {previews.map((p, i) => (
                                        <div key={i} className="relative">
                                            <img src={p} alt="" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm" />
                                            <button
                                                onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <X className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex gap-2 md:gap-3">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nhập tin nhắn..."
                                    disabled={uploading}
                                    className="flex-1 px-3 py-2.5 md:px-5 md:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm md:text-base"
                                />
                                <label className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleSelectFiles}
                                        className="hidden"
                                    />
                                    <Image className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                                </label>
                                <button
                                    onClick={sendMessage}
                                    disabled={(!input.trim() && !selectedFiles.length) || uploading}
                                    className="px-4 py-2.5 md:px-7 md:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2 font-semibold flex-shrink-0 text-sm md:text-base"
                                >
                                    {uploading ? (
                                        <Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                    <span className="hidden md:inline">Gửi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;