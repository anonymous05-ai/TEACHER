/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  GraduationCap, 
  Send, 
  RefreshCw, 
  BookOpen, 
  Type, 
  Mic, 
  FileText, 
  PenTool, 
  CheckCircle, 
  Sparkles,
  ArrowLeft,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToAI } from './services/geminiService';

type Persona = 'student' | 'teacher' | null;

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function App() {
  const [persona, setPersona] = useState<Persona>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const studentInstructions = `Bạn là EduBot, một chuyên gia ngôn ngữ và chatbot hỗ trợ học tập cho học viên. 
  Nhiệm vụ của bạn là giúp họ cải thiện từ vựng, ngữ pháp, phát âm và các kỹ năng nghe, nói, đọc, viết. 
  Hãy trả lời một cách khuyến khích, dễ hiểu, cung cấp ví dụ thực tế và chỉnh sửa lỗi sai cho người dùng nếu cần.
  Sử dụng tiếng Việt để giải thích nếu người dùng hỏi bằng tiếng Việt, nhưng ưu tiên giao tiếp bằng tiếng nước ngoài mà họ đang học nếu phù hợp.`;

  const teacherInstructions = `Bạn là EduBot, một trợ lý giáo dục chuyên nghiệp dành cho giáo viên.
  Nhiệm vụ của bạn là hỗ trợ thiết kế hoạt động giảng dạy, tạo học liệu (bài đọc, audio script), xây dựng đề kiểm tra và tư vấn bồi dưỡng chuyên môn.
  Hãy đưa ra các ý tưởng sáng tạo, cấu trúc học liệu khoa học, chính xác và bám sát mục tiêu sư phạm.`;

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const systemInstruction = persona === 'student' ? studentInstructions : teacherInstructions;
    const aiResponse = await sendMessageToAI(text, systemInstruction, history);

    const botMessage: Message = { role: 'model', content: aiResponse || "Xin lỗi, tôi không thể phản hồi lúc này." };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const resetChat = () => {
    setMessages([]);
    setPersona(null);
  };

  const quickTools = {
    student: [
      { id: 'vocab', label: 'Học từ vựng', icon: <BookOpen className="w-4 h-4" />, prompt: 'Hãy dạy tôi 5 từ vựng mới về chủ đề công nghệ và ví dụ đi kèm.' },
      { id: 'grammar', label: 'Giải thích ngữ pháp', icon: <Type className="w-4 h-4" />, prompt: 'Giải thích cho tôi cách dùng thì Hiện tại hoàn thành (Present Perfect).' },
      { id: 'pronounce', label: 'Luyện phát âm', icon: <Mic className="w-4 h-4" />, prompt: 'Hãy chỉ cho tôi cách phát âm âm /θ/ và /ð/ trong tiếng Anh.' },
      { id: 'writing', label: 'Sửa lỗi viết', icon: <PenTool className="w-4 h-4" />, prompt: 'Tôi sẽ gửi cho bạn một đoạn văn, hãy sửa lỗi ngữ pháp và từ vựng cho tôi nhé.' },
    ],
    teacher: [
      { id: 'lesson', label: 'Thiết kế giáo án', icon: <FileText className="w-4 h-4" />, prompt: 'Hãy thiết kế mộ giáo án cho tiết học 45 phút về chủ đề Bảo vệ môi trường cho học sinh lớp 8.' },
      { id: 'quiz', label: 'Tạo bài kiểm tra', icon: <CheckCircle className="w-4 h-4" />, prompt: 'Tạo một bài kiểm tra trắc nghiệm 10 câu về từ vựng chủ đề Travel.' },
      { id: 'activities', label: 'Hoạt động lớp học', icon: <Sparkles className="w-4 h-4" />, prompt: 'Gợi ý 3 trò chơi khởi động (warm-up activities) thú vị cho lớp học tiếng Anh.' },
      { id: 'pro', label: 'Tư vấn chuyên môn', icon: <GraduationCap className="w-4 h-4" />, prompt: 'Gợi ý cho tôi các phương pháp dạy học tích cực hiệu quả hiện nay.' },
    ]
  };

  if (!persona) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 border-[12px] border-[#E5E1DA]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="col-span-full text-center mb-12">
            <h1 className="font-serif text-6xl font-bold tracking-tighter uppercase text-ink mb-4">
              Luminance <span className="text-xl font-normal italic lowercase block md:inline mt-2 md:mt-0">edu-ai</span>
            </h1>
            <div className="h-[1px] w-24 bg-ink mx-auto mb-6 opacity-30"></div>
            <p className="text-[12px] uppercase tracking-[0.3em] font-semibold opacity-60">AI-Powered Pedagogical Assistant</p>
          </div>

          <button 
            onClick={() => setPersona('student')}
            className="bg-paper-light p-10 border border-ink flex flex-col group text-left relative overflow-hidden transition-all hover:bg-white"
          >
            <div className="absolute top-4 right-4 opacity-5 font-serif italic text-6xl group-hover:opacity-10 transition-opacity">Learner</div>
            <div className="bg-ink text-white w-12 h-12 flex items-center justify-center mb-8">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink mb-4">Chế độ Học viên</h2>
            <ul className="space-y-3 text-[13px] opacity-70 leading-relaxed font-medium">
              <li className="flex items-center gap-2">Cải thiện từ vựng & ngữ pháp chuyên sâu</li>
              <li className="flex items-center gap-2">Luyện kỹ năng Nghe - Nói - Đọc - Viết</li>
              <li className="flex items-center gap-2">Phân tích lỗi sai chi tiết từ AI</li>
            </ul>
            <div className="mt-12 flex items-center text-ink font-bold gap-2 text-[11px] uppercase tracking-widest border-b border-ink/20 w-fit pb-1 group-hover:border-ink transition-all">
              Bắt đầu học ngay <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          <button 
            onClick={() => setPersona('teacher')}
            className="bg-paper-light p-10 border border-ink flex flex-col group text-left relative overflow-hidden transition-all hover:bg-white"
          >
            <div className="absolute top-4 right-4 opacity-5 font-serif italic text-6xl group-hover:opacity-10 transition-opacity">Educator</div>
            <div className="bg-ink text-white w-12 h-12 flex items-center justify-center mb-8">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink mb-4">Chế độ Giáo viên</h2>
            <ul className="space-y-3 text-[13px] opacity-70 leading-relaxed font-medium">
              <li className="flex items-center gap-2">Thiết kế bài giảng & giáo án điện tử</li>
              <li className="flex items-center gap-2">Xây dựng đề kiểm tra theo chủ đề</li>
              <li className="flex items-center gap-2">Tư vấn phương pháp giảng dạy mới</li>
            </ul>
            <div className="mt-12 flex items-center text-ink font-bold gap-2 text-[11px] uppercase tracking-widest border-b border-ink/20 w-fit pb-1 group-hover:border-ink transition-all">
              Khám phá công cụ <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-paper font-sans text-ink overflow-hidden border-[8px] border-[#E5E1DA]">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-72 bg-paper-light border-r border-ink flex-col overflow-hidden">
        <div className="p-8 border-b border-ink">
          <h1 className="font-serif text-2xl font-bold tracking-tighter uppercase flex items-center gap-2">
            Luminance <span className="text-[10px] font-normal italic lowercase tracking-normal">edu</span>
          </h1>
          <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mt-2">Assistant Terminal</p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-10 overflow-y-auto">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-6 px-2">Phân loại công cụ</h4>
            <div className="space-y-1">
              {quickTools[persona].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => handleSend(tool.prompt)}
                  className="w-full flex items-center gap-3 p-3 text-[12px] font-bold uppercase tracking-wide transition-all hover:bg-ink hover:text-white group"
                >
                  <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                    {tool.icon}
                  </div>
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
             <div className="vertical-text text-[10px] uppercase tracking-[0.5em] opacity-20 mb-8 whitespace-nowrap">
                {persona === 'student' ? 'Academic Excellence' : 'Pedagogical Integrity'}
             </div>
             <p className="text-[10px] uppercase tracking-wide leading-relaxed opacity-40 px-2 italic">
                {persona === 'student' 
                  ? 'Ghi nhớ: Hãy chủ động trao đổi để AI giúp bạn tìm ra lối tư duy đúng đắn nhất.' 
                  : 'Trợ lý: Hỗ trợ xây dựng học liệu bám sát chương trình hiện hành.'}
             </p>
          </div>
        </div>

        <div className="p-6 border-t border-ink bg-paper space-y-3">
          <button 
            onClick={resetChat}
            className="w-full flex items-center gap-3 p-3 text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-all border border-transparent hover:border-ink"
          >
            <ArrowLeft className="w-4 h-4" /> Vai trò ban đầu
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="h-20 bg-paper-light border-b border-ink px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={resetChat} className="p-2 -ml-2 hover:text-gray-600 md:hidden"><ArrowLeft className="w-5 h-5" /></button>
             <div className="flex items-baseline gap-3">
               <h2 className="font-serif text-2xl italic font-bold">
                 {persona === 'student' ? 'Luyện kỹ năng' : 'Thiết kế giáo vụ'}
               </h2>
               <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse hidden md:block"></div>
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 hidden md:block">Active Session</span>
             </div>
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
            <button className="opacity-40 hover:opacity-100 hidden sm:block">Lưu phiên</button>
            <button className="opacity-40 hover:opacity-100 hidden sm:block">Tài liệu</button>
            <button className="p-1 px-2 border border-ink hover:bg-ink hover:text-white transition-all">Settings</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-12 md:px-16 space-y-12 relative overflow-x-hidden">
          <div className="absolute top-10 right-10 opacity-5 font-serif italic text-9xl select-none pointer-events-none">
            {persona === 'student' ? 'Insight' : 'Design'}
          </div>
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-20">
              <div className="w-20 h-20 border border-ink flex items-center justify-center mb-10 rotate-45 group-hover:rotate-0 transition-transform">
                <MessageSquare className="w-8 h-8 -rotate-45" />
              </div>
              <h3 className="font-serif text-4xl font-bold text-ink mb-6">EduBot v1.0</h3>
              <p className="text-[14px] leading-extraloose text-ink opacity-60 uppercase tracking-widest mb-10">
                {persona === 'student' 
                  ? 'Hệ thống hỗ trợ học tập ngôn ngữ và tư duy chuyên môn được vận hành bởi trí tuệ nhân tạo.' 
                  : 'Nền tảng thiết kế học liệu và bồi dưỡng giảng dạy dành cho chuyên gia giáo dục.'}
              </p>
              <div className="flex gap-4">
                 <button onClick={() => handleSend(quickTools[persona][0].prompt)} className="border border-ink p-3 px-8 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-ink hover:text-white transition-all">
                   Bắt đầu nhanh
                 </button>
              </div>
            </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-30 px-2 flex gap-2">
                  <span>{msg.role === 'user' ? 'Author' : 'Luminance AI'}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`max-w-[90%] md:max-w-[80%] p-8 overflow-hidden transition-all
                  ${msg.role === 'user' 
                    ? 'bg-ink text-white text-[13px] tracking-wide leading-relaxed' 
                    : 'bg-paper-light text-ink border border-ink/20 font-serif text-lg leading-relaxed shadow-sm italic'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex flex-col items-start gap-2">
               <div className="text-[10px] uppercase tracking-widest font-bold opacity-30 px-2">AI is thinking</div>
               <div className="bg-paper-light p-8 border border-ink/20 max-w-[200px]">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-ink/30 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-ink/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-ink/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-8 md:p-12 border-t border-ink bg-paper-light">
          <div className="max-w-4xl mx-auto flex gap-6 items-center">
            <div className="flex-1 relative">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={persona === 'student' ? "Hỏi bất cứ điều gì..." : "Nhập yêu cầu thiết kế..."}
                className="w-full bg-transparent border-b border-ink/30 py-4 text-sm font-medium focus:outline-none focus:border-ink placeholder:italic placeholder:opacity-30 transition-all"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="bg-ink text-white px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all disabled:opacity-30 whitespace-nowrap"
            >
              Gửi yêu cầu
            </button>
          </div>
          <p className="text-center text-[9px] text-ink opacity-20 mt-8 uppercase tracking-widest italic">
            Academic Integrity • Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
