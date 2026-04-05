/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  User, 
  PanelLeft, 
  Search, 
  ArrowUp, 
  Sparkles,
  Zap,
  Globe,
  Code2,
  Lightbulb,
  Tv,
  Monitor,
  Cpu,
  ChevronRight,
  Palette,
  Fan,
  Bed,
  Shirt,
  RotateCcw,
  Moon,
  Power,
  Terminal,
  Lock,
  Settings2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  Activity,
  Download,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Target {
  id: string;
  name: string;
  ip: string;
  type: 'Linux' | 'Windows' | 'IoT' | 'Network';
  status: 'pending' | 'exploited';
  notes: string;
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeView, setActiveView] = useState<'home' | 'domotica' | 'hacking' | 'projetos'>('home');

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<{type: 'input' | 'output', content: string}[]>([
    { type: 'output', content: 'DOMO-OS [Version 1.0.42]' },
    { type: 'output', content: '(c) Domo Corporation. All rights reserved.' },
    { type: 'output', content: '' },
    { type: 'output', content: 'Welcome, ce060758. Type "help" for a list of commands.' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  // Hacking Targets State
  const [targets, setTargets] = useState<Target[]>([
    { id: '1', name: 'Web Server', ip: '192.168.1.10', type: 'Linux', status: 'pending', notes: 'Servidor web principal da rede local.' },
    { id: '2', name: 'IoT Hub', ip: '192.168.1.45', type: 'IoT', status: 'exploited', notes: 'Acesso root via vulnerabilidade no firmware.' },
    { id: '3', name: 'Eduardo-PC', ip: '192.168.1.22', type: 'Windows', status: 'pending', notes: 'Possível vulnerabilidade RDP.' },
  ]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState({ name: '', ip: '', type: 'Linux' as Target['type'], notes: '' });
  const [activeToolTab, setActiveToolTab] = useState<'recon' | 'exploit' | 'post'>('recon');
  const [customCve, setCustomCve] = useState('');
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [showClearLogPrompt, setShowClearLogPrompt] = useState(false);
  const [isExecutingAutonomous, setIsExecutingAutonomous] = useState(false);
  const [targetSearch, setTargetSearch] = useState('');
  const [terminalView, setTerminalView] = useState<'terminal' | 'recon' | 'resultados' | 'exploracao'>('terminal');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const TypewriterLine = ({ content, onComplete }: { content: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(content.slice(0, i + 1));
        i++;
        if (i >= content.length) {
          clearInterval(interval);
          onComplete?.();
        }
      }, 5); // Very fast typing
      return () => clearInterval(interval);
    }, [content]);

    return <span>{displayedText}</span>;
  };

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (terminalView === 'terminal') {
      scrollToBottom();
    }
  }, [terminalHistory, terminalView]);

  const runCommand = (cmd: string, output: string) => {
    setTerminalHistory(prev => [
      ...prev, 
      { type: 'input', content: cmd },
      { type: 'output', content: output }
    ]);
  };

  const clearConsole = () => {
    setTerminalHistory([]);
  };

  const exportLog = () => {
    const logContent = terminalHistory.map(line => 
      line.type === 'input' ? `$ ${line.content}` : line.content
    ).join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domo_hacking_log_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAutonomousMode = async (target: Target) => {
    if (isExecutingAutonomous) return;
    setIsExecutingAutonomous(true);

    const log = (msg: string, type: 'input' | 'output' = 'output') => {
      setTerminalHistory(prev => [...prev, { type, content: msg }]);
    };

    log(`[AI] Iniciando cadeia de ataque autônomo em ${target.name} (${target.ip})...`);
    await new Promise(r => setTimeout(r, 1500));

    log(`nmap -F ${target.ip}`, 'input');
    await new Promise(r => setTimeout(r, 1000));
    log(`Starting Nmap 7.92 ( https://nmap.org ) at 2026-04-05 23:24 UTC\nNmap scan report for ${target.ip}\nHost is up (0.0021s latency).\nNot shown: 98 closed ports\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n\nNmap done: 1 IP address (1 host up) scanned in 0.45 seconds`);
    
    await new Promise(r => setTimeout(r, 1500));
    log(`[AI] Porta 22 (SSH) detectada. Iniciando tentativa de exploit via força bruta...`);
    
    await new Promise(r => setTimeout(r, 1000));
    log(`hydra -l root -P /usr/share/wordlists/passwords.txt ssh://${target.ip}`, 'input');
    await new Promise(r => setTimeout(r, 2000));
    
    log(`[22][ssh] host: ${target.ip}   login: root   password: admin123`);
    log(`1 of 1 target successfully completed, 1 valid password found`);

    await new Promise(r => setTimeout(r, 1000));
    log(`[AI] Acesso obtido com sucesso! Alvo comprometido.`);
    
    setTargets(prev => prev.map(t => t.id === target.id ? { ...t, status: 'exploited' } : t));
    setShowClearLogPrompt(true);
    setIsExecutingAutonomous(false);
  };

  const handleAddTarget = (e: FormEvent) => {
    e.preventDefault();
    if (!newTarget.name || !newTarget.ip) return;
    
    const target: Target = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTarget.name,
      ip: newTarget.ip,
      type: newTarget.type,
      status: 'pending',
      notes: newTarget.notes
    };
    
    setTargets([...targets, target]);
    setNewTarget({ name: '', ip: '', type: 'Linux', notes: '' });
    setIsAddTargetModalOpen(false);
  };

  const handleTerminalCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'input' as const, content: terminalInput }];
    
    let output = '';
    switch (cmd) {
      case 'help':
        output = 'Available commands: help, clear, ls, whoami, status, domo -v, network';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'ls':
        output = 'drwxr-xr-x  2 user  staff   64B Apr  5 23:11 scripts\n-rw-r--r--  1 user  staff  1.2K Apr  5 23:11 config.json\n-rwxr-xr-x  1 user  staff  4.5K Apr  5 23:11 exploit.py';
        break;
      case 'whoami':
        output = 'ce060758@domo-hub';
        break;
      case 'status':
        output = `System: Online\nCPU: 24%\nMemory: 4.2GB/16GB\nUptime: 14d 02h 45m`;
        break;
      case 'domo -v':
        output = 'DOMO-OS v1.0.42-stable (build 20260405)';
        break;
      case 'network':
        output = 'Scanning local network...\n[+] 192.168.1.1 (Gateway)\n[+] 192.168.1.15 (Smart TV - Sala)\n[+] 192.168.1.22 (Eduardo-PC)\n[+] 192.168.1.45 (IoT-Hub)';
        break;
      default:
        output = `Command not found: ${cmd}. Type "help" for assistance.`;
    }

    setTerminalHistory([...newHistory, { type: 'output' as const, content: output }]);
    setTerminalInput('');
  };

  // Domótica State
  const [devices, setDevices] = useState({
    lights: {
      wardrobe: false,
      eduardoRoom: false,
      pcFan: false,
      pcFanColor: '#ffffff'
    },
    tvs: [
      { id: 'living-room', name: 'Sala de Estar', status: false },
      { id: 'bedroom', name: 'Quarto', status: false },
      { id: 'office', name: 'Escritório', status: false }
    ],
    computer: false
  });

  const toggleLight = (key: keyof typeof devices.lights) => {
    if (key === 'pcFanColor') return;
    setDevices(prev => ({
      ...prev,
      lights: {
        ...prev.lights,
        [key]: !prev.lights[key as keyof typeof prev.lights]
      }
    }));
  };

  const setPcFanColor = (color: string) => {
    setDevices(prev => ({
      ...prev,
      lights: { ...prev.lights, pcFanColor: color }
    }));
  };

  const toggleTv = (id: string) => {
    setDevices(prev => ({
      ...prev,
      tvs: prev.tvs.map(tv => tv.id === id ? { ...tv, status: !tv.status } : tv)
    }));
  };

  const toggleDevice = (device: 'computer') => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  return (
    <div className="flex h-screen bg-[#000000] text-[#ececec] font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col bg-[#171717] border-r border-[#262626] h-full"
          >
            <div className="p-3 flex flex-col h-full">
              {/* Toggle Sidebar Button */}
              <div className="mb-4">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors"
                  title="Ocultar barra lateral"
                >
                  <PanelLeft className="w-5 h-5 text-[#676767]" />
                </button>
              </div>

              {/* Categories Section */}
              <div className="flex-1 overflow-y-auto space-y-1">
                <button 
                  onClick={() => setActiveView('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group relative ${activeView === 'home' ? 'bg-[#2f2f2f] text-white' : 'text-gray-400 hover:bg-[#2f2f2f] hover:text-white'}`}
                >
                  {activeView === 'home' && (
                    <motion.div 
                      layoutId="activeSidebar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"
                    />
                  )}
                  <MessageSquare className={`w-4 h-4 ${activeView === 'home' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={activeView === 'home' ? 'font-bold' : 'font-medium'}>Início (Chat)</span>
                </button>
                <button 
                  onClick={() => setActiveView('domotica')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group relative ${activeView === 'domotica' ? 'bg-[#2f2f2f] text-white' : 'text-gray-400 hover:bg-[#2f2f2f] hover:text-white'}`}
                >
                  {activeView === 'domotica' && (
                    <motion.div 
                      layoutId="activeSidebar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"
                    />
                  )}
                  <Zap className={`w-4 h-4 ${activeView === 'domotica' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={activeView === 'domotica' ? 'font-bold' : 'font-medium'}>Domótica</span>
                </button>
                <button 
                  onClick={() => setActiveView('hacking')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group relative ${activeView === 'hacking' ? 'bg-[#2f2f2f] text-white' : 'text-gray-400 hover:bg-[#2f2f2f] hover:text-white'}`}
                >
                  {activeView === 'hacking' && (
                    <motion.div 
                      layoutId="activeSidebar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"
                    />
                  )}
                  <Terminal className={`w-4 h-4 ${activeView === 'hacking' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={activeView === 'hacking' ? 'font-bold' : 'font-medium'}>Hacking</span>
                </button>
                <button 
                  onClick={() => setActiveView('projetos')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group relative ${activeView === 'projetos' ? 'bg-[#2f2f2f] text-white' : 'text-gray-400 hover:bg-[#2f2f2f] hover:text-white'}`}
                >
                  {activeView === 'projetos' && (
                    <motion.div 
                      layoutId="activeSidebar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"
                    />
                  )}
                  <Globe className={`w-4 h-4 ${activeView === 'projetos' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={activeView === 'projetos' ? 'font-bold' : 'font-medium'}>Projetos</span>
                </button>
              </div>

              {/* Sidebar Footer - Settings only */}
              <div className="mt-auto pt-2 border-t border-[#262626]">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2f2f2f] transition-all text-xs group">
                  <Settings className="w-4 h-4 text-[#676767] group-hover:text-white transition-colors" />
                  <span className="text-[#676767] group-hover:text-white font-medium transition-colors">Configurações</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full bg-[#000000]">
        {activeView === 'home' ? (
          <>
            {/* Logo Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-[#ececec] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Sparkles className="w-12 h-12 text-black" />
                </div>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-4 pb-8 w-full max-w-3xl mx-auto">
              <div className="relative bg-[#171717] rounded-3xl border border-[#262626] shadow-xl focus-within:border-[#404040] transition-colors flex items-end">
                {/* Attach Button */}
                <div className="pl-3 pb-3">
                  <button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="p-2 hover:bg-[#2f2f2f] rounded-full transition-colors text-[#ececec]"
                    title="Anexar arquivos"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    multiple 
                    onChange={(e) => {
                      console.log('Arquivos selecionados:', e.target.files);
                    }}
                  />
                </div>

                <textarea
                  rows={1}
                  placeholder="Mensagem para o ChatGPT"
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-4 px-2 text-[#ececec] placeholder-[#676767] max-h-52 min-h-[56px]"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setInputValue('');
                      e.currentTarget.style.height = 'auto';
                    }
                  }}
                />

                {/* Send Button */}
                <div className="pr-3 pb-3">
                  <button 
                    disabled={!inputValue.trim()}
                    className={`p-2 rounded-full transition-all flex items-center justify-center ${
                      inputValue.trim() ? 'bg-white text-black hover:bg-[#e5e5e5]' : 'bg-[#333333] text-[#676767]'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#676767] text-center mt-3">
                O ChatGPT pode cometer erros. Verifique informações importantes.
              </p>
            </div>
          </>
        ) : activeView === 'domotica' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full overflow-y-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-4xl w-full"
            >
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-white text-black">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter uppercase">Domo</span>
                </div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#262626] to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lights Card - Expanded */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border bg-[#171717] border-[#262626] flex flex-col gap-6 md:col-span-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 text-white">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Luzes</h3>
                    </div>
                    <button className="text-xs text-[#676767] hover:text-white flex items-center gap-1 transition-colors">
                      Ver Todas <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Wardrobe */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#212121] border border-transparent hover:border-[#333333] transition-all">
                      <div className="flex items-center gap-3">
                        <Shirt className={`w-5 h-5 ${devices.lights.wardrobe ? 'text-white' : 'text-[#676767]'}`} />
                        <span className="text-sm font-medium">Guarda-roupa</span>
                      </div>
                      <button 
                        onClick={() => toggleLight('wardrobe')}
                        className={`w-10 h-5 rounded-full p-1 transition-colors relative ${devices.lights.wardrobe ? 'bg-white' : 'bg-[#333333]'}`}
                      >
                        <div className={`w-3 h-3 ${devices.lights.wardrobe ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 ${devices.lights.wardrobe ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Eduardo Room */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#212121] border border-transparent hover:border-[#333333] transition-all">
                      <div className="flex items-center gap-3">
                        <Bed className={`w-5 h-5 ${devices.lights.eduardoRoom ? 'text-white' : 'text-[#676767]'}`} />
                        <span className="text-sm font-medium">Quarto Sr. Eduardo</span>
                      </div>
                      <button 
                        onClick={() => toggleLight('eduardoRoom')}
                        className={`w-10 h-5 rounded-full p-1 transition-colors relative ${devices.lights.eduardoRoom ? 'bg-white' : 'bg-[#333333]'}`}
                      >
                        <div className={`w-3 h-3 ${devices.lights.eduardoRoom ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 ${devices.lights.eduardoRoom ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* PC Fan LEDs */}
                    <div className="p-3 rounded-2xl bg-[#212121] border border-transparent hover:border-[#333333] transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Fan className={`w-5 h-5 ${devices.lights.pcFan ? 'text-white' : 'text-[#676767]'}`} />
                          <span className="text-sm font-medium">LED's Fan PC</span>
                        </div>
                        <button 
                          onClick={() => toggleLight('pcFan')}
                          className={`w-10 h-5 rounded-full p-1 transition-colors relative ${devices.lights.pcFan ? 'bg-white' : 'bg-[#333333]'}`}
                        >
                          <div className={`w-3 h-3 ${devices.lights.pcFan ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 ${devices.lights.pcFan ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      
                      {devices.lights.pcFan && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="flex items-center gap-2 pt-2 border-t border-[#333333]"
                        >
                          <Palette className="w-4 h-4 text-[#676767]" />
                          <div className="flex gap-2">
                            {['#ffffff', '#d4d4d4', '#737373', '#404040', '#262626'].map(color => (
                              <button
                                key={color}
                                onClick={() => setPcFanColor(color)}
                                className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${devices.lights.pcFanColor === color ? 'border-white ring-1 ring-white ring-offset-1 ring-offset-black' : 'border-[#404040]'}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* TV Card - Expanded */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border bg-[#171717] border-[#262626] flex flex-col gap-6 md:col-span-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 text-white">
                        <Tv className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Televisão</h3>
                    </div>
                    <button className="text-xs text-[#676767] hover:text-white flex items-center gap-1 transition-colors">
                      Gerenciar <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {devices.tvs.map((tv) => (
                      <div key={tv.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#212121] border border-transparent hover:border-[#333333] transition-all">
                        <div className="flex items-center gap-3">
                          <Tv className={`w-5 h-5 ${tv.status ? 'text-white' : 'text-[#676767]'}`} />
                          <span className="text-sm font-medium">{tv.name}</span>
                        </div>
                        <button 
                          onClick={() => toggleTv(tv.id)}
                          className={`w-10 h-5 rounded-full p-1 transition-colors relative ${tv.status ? 'bg-white' : 'bg-[#333333]'}`}
                        >
                          <div className={`w-3 h-3 ${tv.status ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 ${tv.status ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Computer Card - Expanded */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border bg-[#171717] border-[#262626] flex flex-col gap-6 md:col-span-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 text-white">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Computador</h3>
                    </div>
                    <button 
                      onClick={() => toggleDevice('computer')}
                      className={`w-10 h-5 rounded-full p-1 transition-colors relative ${devices.computer ? 'bg-white' : 'bg-[#333333]'}`}
                    >
                      <div className={`w-3 h-3 ${devices.computer ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 ${devices.computer ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {devices.computer && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="pt-2 border-t border-[#262626]">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-[#676767] uppercase tracking-wider">Ações Rápidas</p>
                            <button className="text-[10px] flex items-center gap-1 text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest">
                              <Settings2 className="w-3 h-3" />
                              Gerenciar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center gap-2 p-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] transition-colors text-xs font-medium">
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reiniciar
                            </button>
                            <button className="flex items-center gap-2 p-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] transition-colors text-xs font-medium">
                              <Moon className="w-3.5 h-3.5" />
                              Suspender
                            </button>
                            <button className="flex items-center gap-2 p-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] transition-colors text-xs font-medium">
                              <Lock className="w-3.5 h-3.5" />
                              Bloquear
                            </button>
                            <button className="flex items-center gap-2 p-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] transition-colors text-xs font-medium">
                              <Terminal className="w-3.5 h-3.5" />
                              Terminal
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#676767]">Uso de CPU</span>
                            <span className="text-xs font-mono">24%</span>
                          </div>
                          <div className="w-full h-1 bg-[#333333] rounded-full overflow-hidden">
                            <div className="h-full bg-white w-[24%]" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!devices.computer && (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-[#676767]">
                      <Power className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">Dispositivo Offline</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : activeView === 'hacking' ? (
          <div className="flex-1 flex flex-col p-6 w-full max-w-6xl mx-auto h-full overflow-hidden gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#171717] border border-[#262626]">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Hacking Operations</h2>
                  <p className="text-xs text-[#676767]">Gerencie alvos e execute ferramentas de exploração.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-[#171717] border border-[#262626] px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] font-bold text-[#676767] uppercase tracking-widest">Modo Autônomo</span>
                  <button 
                    onClick={() => {
                      const nextMode = !isAutonomousMode;
                      setIsAutonomousMode(nextMode);
                      if (nextMode && selectedTargetId) {
                        const target = targets.find(t => t.id === selectedTargetId);
                        if (target) handleAutonomousMode(target);
                      }
                    }}
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors relative ${isAutonomousMode ? 'bg-green-500' : 'bg-[#333333]'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isAutonomousMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <button 
                  onClick={() => setIsAddTargetModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-[#e5e5e5] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Alvo
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
              {/* Targets List */}
              <div className="w-full lg:w-80 flex flex-col gap-4 overflow-hidden">
                {/* Active Targets Summary Card */}
                <div className="p-5 rounded-2xl bg-[#171717] border border-[#262626] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-bold text-[#676767] uppercase tracking-widest mb-3">Alvos Ativos</span>
                  <span className="text-5xl font-black text-white mb-3 tracking-tighter">{targets.length}</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-tight">Sistema Online</span>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-[#676767] group-focus-within:text-white transition-colors" />
                  </div>
                  <input 
                    type="text"
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    placeholder="IP, domínio ou Rede (ex: 189.892.1.1)"
                    className="w-full bg-[#171717] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-white/20 transition-all placeholder:text-[#404040]"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-[#262626]">
                  {targets
                    .filter(t => 
                      t.name.toLowerCase().includes(targetSearch.toLowerCase()) || 
                      t.ip.includes(targetSearch)
                    )
                    .map((target) => (
                    <button
                      key={target.id}
                      onClick={() => {
                        setSelectedTargetId(target.id);
                        if (isAutonomousMode) handleAutonomousMode(target);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${
                        selectedTargetId === target.id 
                          ? 'bg-[#171717] border-white/20 ring-1 ring-white/10' 
                          : 'bg-[#0a0a0a] border-[#262626] hover:border-[#404040]'
                      }`}
                    >
                      {selectedTargetId === target.id && (
                        <motion.div 
                          layoutId="activeTarget"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                        />
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {target.type === 'Linux' ? <Server className="w-3 h-3 text-[#676767]" /> : 
                           target.type === 'Windows' ? <Monitor className="w-3 h-3 text-[#676767]" /> :
                           target.type === 'IoT' ? <Cpu className="w-3 h-3 text-[#676767]" /> :
                           <Globe className="w-3 h-3 text-[#676767]" />}
                          <span className="text-[10px] font-bold text-[#676767] uppercase tracking-tighter">{target.type}</span>
                        </div>
                        {target.status === 'exploited' ? (
                          <ShieldCheck className="w-3 h-3 text-green-500" />
                        ) : (
                          <Activity className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <h4 className="font-bold text-sm mb-1">{target.name}</h4>
                      <p className="text-xs font-mono text-[#676767]">{target.ip}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal Area */}
              <div className="flex-[2] flex flex-col bg-black border border-[#262626] rounded-2xl overflow-hidden shadow-2xl min-w-0 min-h-[400px] lg:min-h-0">
                {/* Terminal Header */}
                <div className="bg-[#111111] px-4 py-2 border-b border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#676767] shrink-0" />
                      <span className="text-[10px] sm:text-xs font-mono text-[#676767] truncate max-w-[150px] sm:max-w-none">
                        {selectedTargetId ? (
                          <span className="text-white">ce060758@domo-hub: <span className="text-green-500">[{targets.find(t => t.id === selectedTargetId)?.name}]</span> ~</span>
                        ) : (
                          <span>ce060758@domo-hub: ~</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4 border-l border-[#262626] pl-3 sm:pl-6">
                      <button 
                        onClick={() => setTerminalView('terminal')}
                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${terminalView === 'terminal' ? 'text-white' : 'text-[#676767] hover:text-white/60'}`}
                      >
                        TERMINAL
                        {terminalView === 'terminal' && (
                          <motion.div layoutId="activeTerminalTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white" />
                        )}
                      </button>
                      <button 
                        onClick={() => setTerminalView('recon')}
                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${terminalView === 'recon' ? 'text-white' : 'text-[#676767] hover:text-white/60'}`}
                      >
                        RECON
                        {terminalView === 'recon' && (
                          <motion.div layoutId="activeTerminalTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white" />
                        )}
                      </button>
                      <button 
                        onClick={() => setTerminalView('resultados')}
                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${terminalView === 'resultados' ? 'text-white' : 'text-[#676767] hover:text-white/60'}`}
                      >
                        RESULTADOS
                        {terminalView === 'resultados' && (
                          <motion.div layoutId="activeTerminalTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white" />
                        )}
                      </button>
                      <button 
                        onClick={() => setTerminalView('exploracao')}
                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${terminalView === 'exploracao' ? 'text-white' : 'text-[#676767] hover:text-white/60'}`}
                      >
                        EXPLORAÇÃO
                        {terminalView === 'exploracao' && (
                          <motion.div layoutId="activeTerminalTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#262626] pt-2 sm:pt-0">
                    <div className="flex gap-2">
                      <button 
                        onClick={clearConsole}
                        className="text-[9px] sm:text-[10px] font-bold text-[#676767] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span className="hidden min-[450px]:inline">Limpar console</span>
                        <span className="min-[450px]:hidden">Limpar</span>
                      </button>
                      <button 
                        onClick={exportLog}
                        className="text-[9px] sm:text-[10px] font-bold text-[#676767] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Download className="w-3 h-3" />
                        <span className="hidden min-[450px]:inline">Exportar log</span>
                        <span className="min-[450px]:hidden">Exportar</span>
                      </button>
                    </div>
                    <div className="hidden sm:flex gap-1.5 ml-2 border-l border-[#262626] pl-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
                    </div>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent text-green-400/90 bg-[#050505]">
                  {terminalView === 'terminal' ? (
                    <div className="space-y-1.5">
                      {terminalHistory.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap break-all">
                          {line.type === 'input' ? (
                            <div className="flex gap-2 items-start">
                              <span className="text-white/40 shrink-0 select-none">$</span>
                              <span className="text-white/90 font-bold">{line.content}</span>
                            </div>
                          ) : (
                            <div className="text-green-400/80 leading-relaxed pl-4 border-l border-green-500/10 [text-shadow:0_0_5px_rgba(74,222,128,0.2)]">
                              {i === terminalHistory.length - 1 ? (
                                <TypewriterLine content={line.content} />
                              ) : (
                                line.content
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Input Line */}
                      <form onSubmit={handleTerminalCommand} className="flex gap-2 items-center pt-2 group">
                        <span className="text-white/40 shrink-0 select-none group-focus-within:text-green-500/50 transition-colors">$</span>
                        <div className="flex-1 relative flex items-center">
                          <input
                            autoFocus
                            type="text"
                            value={terminalInput}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-white caret-green-500"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder={selectedTargetId ? `Exploiting ${targets.find(t => t.id === selectedTargetId)?.name}...` : "Aguardando comando..."}
                          />
                        </div>
                      </form>
                      <div ref={terminalEndRef} className="h-4" />
                    </div>
                  ) : terminalView === 'recon' ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6 border-b border-[#262626] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Search className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Reconhecimento Ativo</h4>
                            <p className="text-[10px] text-[#676767]">Mapeamento de rede e serviços</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center text-[#676767] py-20">
                        <Globe className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-xs">Execute um scan para popular esta área.</p>
                      </div>
                    </div>
                  ) : terminalView === 'resultados' ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6 border-b border-[#262626] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Relatório de Vulnerabilidades</h4>
                            <p className="text-[10px] text-[#676767]">Análise detalhada do alvo selecionado</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">SCAN COMPLETO</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#262626]">
                        {selectedTargetId ? (
                          <>
                            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#676767] uppercase">Portas Abertas</span>
                                <span className="text-[10px] font-mono text-white">2 detectadas</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 rounded bg-[#171717] border border-[#262626]">
                                  <span className="text-xs font-mono text-green-400">22/tcp</span>
                                  <span className="text-[10px] text-[#676767]">OpenSSH 8.2p1 Ubuntu</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-[#171717] border border-[#262626]">
                                  <span className="text-xs font-mono text-green-400">80/tcp</span>
                                  <span className="text-[10px] text-[#676767]">Apache httpd 2.4.41</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-3">
                              <span className="text-[10px] font-bold text-[#676767] uppercase">Vulnerabilidades Críticas</span>
                              <div className="space-y-2">
                                <div className="p-3 rounded bg-red-500/5 border border-red-500/20 flex items-start gap-3">
                                  <div className="mt-0.5 p-1 rounded bg-red-500/20">
                                    <Zap className="w-3 h-3 text-red-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-red-400">SSH Brute Force Vulnerability</p>
                                    <p className="text-[10px] text-[#676767] mt-1">O serviço SSH permite múltiplas tentativas de login sem bloqueio temporário.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-[#676767] py-20">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-xs">Nenhum alvo selecionado para análise.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6 border-b border-[#262626] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                            <Zap className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Painel de Exploração</h4>
                            <p className="text-[10px] text-[#676767]">Configuração de payloads e exploits</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#262626]">
                        {selectedTargetId ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-4">
                              <h5 className="text-[10px] font-bold text-white uppercase">Payload Config</h5>
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-[#676767] uppercase">LHOST</label>
                                  <div className="p-2 rounded bg-[#171717] border border-[#262626] text-[10px] font-mono text-white">10.0.0.15</div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-[#676767] uppercase">LPORT</label>
                                  <div className="p-2 rounded bg-[#171717] border border-[#262626] text-[10px] font-mono text-white">4444</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-4">
                              <h5 className="text-[10px] font-bold text-white uppercase">Exploit Status</h5>
                              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#262626] flex items-center justify-center">
                                  <Activity className="w-5 h-5 text-[#262626]" />
                                </div>
                                <span className="text-[10px] text-[#676767]">Aguardando execução...</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-[#676767] py-20">
                            <Zap className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-xs">Selecione um alvo para configurar o exploit.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tools Panel */}
              <div className={`w-full lg:w-80 flex flex-col gap-4 overflow-hidden transition-opacity duration-300 ${isAutonomousMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-[#676767] uppercase tracking-widest">Ferramentas</span>
                  <div className="flex gap-1">
                    {(['recon', 'exploit', 'post'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveToolTab(tab)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                          activeToolTab === tab ? 'bg-white text-black' : 'text-[#676767] hover:text-white'
                        }`}
                      >
                        {tab === 'recon' ? 'Recon' : tab === 'exploit' ? 'Exploit' : 'Post'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 bg-[#171717] border border-[#262626] rounded-2xl p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#262626]">
                  {/* Common Target Display */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#676767] uppercase tracking-wider">Alvo Selecionado</label>
                    <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#262626] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{selectedTargetId ? targets.find(t => t.id === selectedTargetId)?.name : 'Nenhum'}</span>
                        <span className="text-[10px] font-mono text-[#676767]">{selectedTargetId ? targets.find(t => t.id === selectedTargetId)?.ip : '0.0.0.0'}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[#262626]">
                        <Activity className={`w-3 h-3 ${selectedTargetId ? 'text-green-500' : 'text-[#676767]'}`} />
                      </div>
                    </div>
                  </div>

                  {activeToolTab === 'recon' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white/90">Reconhecimento de Rede</h4>
                        <p className="text-[10px] text-[#676767]">Identifique portas abertas e serviços rodando no alvo.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <button 
                          disabled={!selectedTargetId}
                          onClick={() => {
                            const target = targets.find(t => t.id === selectedTargetId);
                            runCommand(`nmap -F ${target?.ip}`, `Starting Nmap 7.92... \nHost is up (0.002s latency).\nNot shown: 98 closed ports\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n\nNmap done: 1 IP address (1 host up) scanned in 0.45 seconds`);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-[#212121] border border-[#333333] hover:border-white/20 hover:bg-[#2f2f2f] transition-all text-xs font-bold flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Nmap Rápido</span>
                          <ChevronRight className="w-3 h-3 text-[#676767] group-hover:text-white transition-colors" />
                        </button>
                        <button 
                          disabled={!selectedTargetId}
                          onClick={() => {
                            const target = targets.find(t => t.id === selectedTargetId);
                            runCommand(`nmap -sV ${target?.ip}`, `Starting Nmap 7.92... \nNmap scan report for ${target?.ip}\nHost is up (0.005s latency).\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 6.12 seconds`);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-[#212121] border border-[#333333] hover:border-white/20 hover:bg-[#2f2f2f] transition-all text-xs font-bold flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Nmap Completo</span>
                          <ChevronRight className="w-3 h-3 text-[#676767] group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeToolTab === 'exploit' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white/90">Exploração de Vulnerabilidades</h4>
                        <p className="text-[10px] text-[#676767]">Execute exploits para ganhar acesso ao sistema.</p>
                      </div>
                      <div className="space-y-3">
                        <button 
                          disabled={!selectedTargetId}
                          onClick={() => {
                            const target = targets.find(t => t.id === selectedTargetId);
                            runCommand(`python3 exploit_ssh.py --target ${target?.ip}`, `[+] Initializing SSH Exploit Module...\n[*] Target: ${target?.ip}:22\n[*] Attempting authentication bypass...\n[!] Vulnerability detected: CVE-2023-38039\n[+] Exploit payload sent successfully.\n[+] Connection established. Shell spawned.\n[+] UID: 0 (root)`);
                            setTargets(prev => prev.map(t => t.id === selectedTargetId ? { ...t, status: 'exploited' } : t));
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all text-xs font-bold text-red-500 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Executar Exploit SSH</span>
                          <Zap className="w-3 h-3" />
                        </button>
                        
                        <div className="pt-2 border-t border-[#262626] space-y-2">
                          <label className="text-[10px] font-bold text-[#676767] uppercase tracking-wider">CVE Personalizado (Opcional)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={customCve}
                              onChange={(e) => setCustomCve(e.target.value)}
                              placeholder="ex: CVE-2024-..."
                              className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-[10px] focus:border-white outline-none"
                            />
                            <button 
                              disabled={!selectedTargetId || !customCve}
                              onClick={() => {
                                const target = targets.find(t => t.id === selectedTargetId);
                                runCommand(`exploit-db --cve ${customCve} --target ${target?.ip}`, `[*] Searching exploit for ${customCve}...\n[+] Exploit found in local database.\n[*] Launching attack on ${target?.ip}...\n[!] Error: Target not vulnerable to specified CVE.`);
                              }}
                              className="px-3 py-2 bg-[#262626] rounded-lg text-[10px] font-bold hover:bg-[#333333] transition-colors disabled:opacity-50"
                            >
                              Run
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeToolTab === 'post' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white/90">Pós-Exploração</h4>
                        <p className="text-[10px] text-[#676767]">Limpe seus rastros e colete dados sensíveis.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <button 
                          disabled={!selectedTargetId}
                          onClick={() => {
                            runCommand(`sh clear_logs.sh`, `[*] Searching for system logs...\n[*] Found: /var/log/auth.log\n[*] Found: /var/log/syslog\n[*] Found: /var/log/apache2/access.log\n[+] Logs cleared successfully.\n[+] Traces removed from system.`);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-[#212121] border border-[#333333] hover:border-white/20 hover:bg-[#2f2f2f] transition-all text-xs font-bold flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Limpar Logs</span>
                          <RotateCcw className="w-3 h-3 text-[#676767] group-hover:text-white transition-colors" />
                        </button>
                        <button 
                          disabled={!selectedTargetId}
                          onClick={() => {
                            runCommand(`collect-evidence --all`, `[*] Initializing evidence collection...\n[*] Dumping process list...\n[*] Extracting network configurations...\n[*] Capturing terminal buffer...\n[+] Evidence saved to: /home/user/evidence_${new Date().toISOString().split('T')[0]}.txt`);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-[#212121] border border-[#333333] hover:border-white/20 hover:bg-[#2f2f2f] transition-all text-xs font-bold flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Coletar Evidências</span>
                          <Lock className="w-3 h-3 text-[#676767] group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Clear Log Prompt Modal */}
      <AnimatePresence>
        {showClearLogPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#171717] border border-[#262626] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acesso Obtido</h3>
              <p className="text-[#676767] text-sm mb-8">O alvo foi comprometido com sucesso. Deseja limpar os logs de acesso agora?</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setTerminalHistory(prev => [...prev, { type: 'input', content: 'rm -rf /var/log/*' }, { type: 'output', content: 'Logs cleared successfully.' }]);
                    setShowClearLogPrompt(false);
                  }}
                  className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-[#e5e5e5] transition-colors"
                >
                  Sim, limpar logs
                </button>
                <button 
                  onClick={() => setShowClearLogPrompt(false)}
                  className="w-full py-3 bg-[#262626] text-white rounded-xl font-bold hover:bg-[#333333] transition-colors"
                >
                  Não agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Target Modal */}
            <AnimatePresence>
              {isAddTargetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddTargetModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#171717] border border-[#262626] rounded-3xl p-6 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Novo Alvo</h3>
                      <button 
                        onClick={() => setIsAddTargetModalOpen(false)}
                        className="p-2 hover:bg-[#2f2f2f] rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-[#676767]" />
                      </button>
                    </div>

                    <form onSubmit={handleAddTarget} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#676767] uppercase mb-1.5 ml-1">Nome do Alvo</label>
                        <input 
                          type="text" 
                          required
                          value={newTarget.name}
                          onChange={(e) => setNewTarget({...newTarget, name: e.target.value})}
                          placeholder="ex: Servidor de Arquivos"
                          className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#676767] uppercase mb-1.5 ml-1">IP ou Domínio</label>
                        <input 
                          type="text" 
                          required
                          value={newTarget.ip}
                          onChange={(e) => setNewTarget({...newTarget, ip: e.target.value})}
                          placeholder="ex: 192.168.1.100"
                          className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#676767] uppercase mb-1.5 ml-1">Tipo de Sistema</label>
                        <select 
                          value={newTarget.type}
                          onChange={(e) => setNewTarget({...newTarget, type: e.target.value as Target['type']})}
                          className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none appearance-none"
                        >
                          <option value="Linux">Linux</option>
                          <option value="Windows">Windows</option>
                          <option value="IoT">IoT</option>
                          <option value="Network">Network</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#676767] uppercase mb-1.5 ml-1">Notas</label>
                        <textarea 
                          rows={3}
                          value={newTarget.notes}
                          onChange={(e) => setNewTarget({...newTarget, notes: e.target.value})}
                          placeholder="Observações sobre o alvo..."
                          className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none resize-none"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-[#e5e5e5] transition-colors mt-4"
                      >
                        Salvar Alvo
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
            <h1 className="text-2xl font-bold text-[#676767]">Página em desenvolvimento: {activeView}</h1>
          </div>
        )}

        {/* Toggle Sidebar Button (Floating when closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 p-2 hover:bg-[#212121] rounded-lg transition-colors z-20"
          >
            <PanelLeft className="w-5 h-5 text-[#676767]" />
          </button>
        )}
      </main>
    </div>
  );
}
