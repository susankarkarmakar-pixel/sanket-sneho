import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Ambulance,
  BellRing,
  CalendarCheck2,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  HeartPulse,
  Home,
  Info,
  LifeBuoy,
  LocateFixed,
  MapPin,
  Mic,
  MicOff,
  Phone,
  RefreshCw,
  ShieldCheck,
  Siren,
  UsersRound,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'sanket-sneho-phase1';
const APP_VERSION = 'Phase 1 • Test mode';

const defaultData = {
  profile: null,
  buddy: { name: 'মিতালি দাস', phone: '9830012345', type: 'ASHA সহায়ক' },
  familyContact: { name: 'রাহুল দেবী', relationship: 'ছেলে', phone: '9000012345' },
  checkin: null,
  alert: null,
  emergencyLog: [],
};

function readSavedData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  } catch {
    return defaultData;
  }
}

function formatTime(value) {
  if (!value) return 'এখনও হয়নি';
  return new Intl.DateTimeFormat('bn-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat('bn-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function App() {
  const [data, setData] = useState(readSavedData);
  const [tab, setTab] = useState('home');
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [onboardingValues, setOnboardingValues] = useState({ displayName: '', phone: '', villageName: '', wardNumber: '' });
  const [buddyValues, setBuddyValues] = useState({ name: '', phone: '', type: 'ASHA সহায়ক' });
  const recognitionRef = useRef(null);
  const profile = data.profile || null;
  const buddy = data.buddy || defaultData.buddy;
  const familyContact = data.familyContact || defaultData.familyContact;
  const elderName = profile?.displayName || 'সরস্বতী দেবী';
  const elderInitial = elderName.trim().charAt(0) || 'স';

  const hasCheckedIn = isToday(data.checkin?.timestamp);
  const alertStatus = data.alert?.status || (hasCheckedIn ? 'checked_in' : 'pending');

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('ইন্টারনেট ফিরে এসেছে। আপনার তথ্য নিরাপদে সিঙ্ক হবে।');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('ইন্টারনেট নেই। চিন্তা করবেন না—চেক-ইন এই ফোনে রাখা হবে।');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const completeOnboarding = (event) => {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(onboardingValues).map(([key, value]) => [key, value.trim()]));
    if (!cleaned.displayName || !cleaned.phone || !cleaned.villageName) {
      showToast('নাম, ফোন নম্বর এবং গ্রামের নাম লিখুন।');
      return;
    }
    setData((previous) => ({
      ...previous,
      profile: { ...cleaned, role: 'elder', createdAt: new Date().toISOString() },
    }));
    showToast('আপনার প্রোফাইল তৈরি হয়েছে। স্বাগতম।');
  };

  const checkIn = () => {
    const timestamp = new Date().toISOString();
    setData((previous) => ({
      ...previous,
      checkin: { timestamp, syncState: isOnline ? 'synced' : 'waiting_to_sync' },
      alert: null,
    }));
    showToast(isOnline ? 'আজকের খোঁজ জানানো হয়েছে। ভালো থাকুন।' : 'চেক-ইন ফোনে রাখা হয়েছে—ইন্টারনেট এলে পাঠানো হবে।');
  };

  const simulateMissedCheckIn = () => {
    setData((previous) => ({
      ...previous,
      alert: { type: 'checkin', status: 'awaiting_buddy', createdAt: new Date().toISOString() },
    }));
    setTab('activity');
    showToast('পরীক্ষা: আপনার সহায়কের কাছে সতর্কবার্তা পাঠানো হয়েছে।');
  };

  const acknowledgeBuddy = () => {
    setData((previous) => ({
      ...previous,
      alert: previous.alert ? { ...previous.alert, status: 'buddy_acknowledged', acknowledgedAt: new Date().toISOString() } : previous.alert,
    }));
    showToast('সহায়ক আপনার খবর নিয়েছেন।');
  };

  const escalateToFamily = () => {
    setData((previous) => ({
      ...previous,
      alert: previous.alert ? { ...previous.alert, status: 'family_escalated', familyNotifiedAt: new Date().toISOString() } : previous.alert,
    }));
    showToast(`${familyContact.name}-কে এখন জানানো হয়েছে।`);
  };

  const openBuddyEditor = () => {
    setBuddyValues({ name: buddy.name, phone: buddy.phone, type: buddy.type });
    setAssignmentOpen(true);
  };

  const saveBuddyAssignment = (event) => {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(buddyValues).map(([key, value]) => [key, value.trim()]));
    if (!cleaned.name || !cleaned.phone) {
      showToast('সহায়কের নাম এবং ফোন নম্বর লিখুন।');
      return;
    }
    setData((previous) => ({ ...previous, buddy: { ...cleaned, assignedAt: new Date().toISOString() } }));
    setAssignmentOpen(false);
    showToast(`${cleaned.name}-কে আপনার সহায়ক হিসেবে রাখা হয়েছে।`);
  };

  const sendEmergency = (type) => {
    const entry = { type, createdAt: new Date().toISOString(), locationShared: isOnline };
    setData((previous) => ({
      ...previous,
      emergencyLog: [entry, ...previous.emergencyLog].slice(0, 8),
      alert: { type, status: 'sent', createdAt: entry.createdAt },
    }));
    setModal(null);
    showToast(type === 'sos' ? 'SOS সতর্কবার্তা পাঠানো হয়েছে।' : 'অ্যাম্বুলেন্সের জন্য প্রস্তুত করা হয়েছে।');
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('এই ব্রাউজারে কণ্ঠস্বর সুবিধা নেই। নিচের বড় বোতাম ব্যবহার করুন।');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const spoken = Array.from(event.results).map((result) => result[0].transcript).join('');
      setTranscript(spoken);
    };
    recognition.onerror = () => {
      setIsListening(false);
      showToast('কথাটি শোনা যায়নি। আবার চেষ্টা করুন।');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setTranscript('');
    recognition.start();
  };

  const status = useMemo(() => {
    if (alertStatus === 'awaiting_buddy') return { label: 'সহায়কের উত্তর অপেক্ষায়', tone: 'amber', icon: BellRing };
    if (alertStatus === 'buddy_acknowledged') return { label: 'সহায়ক খবর নিয়েছেন', tone: 'teal', icon: UsersRound };
    if (alertStatus === 'family_escalated') return { label: 'পরিবারকে সতর্ক করা হয়েছে', tone: 'red', icon: UsersRound };
    if (alertStatus === 'sent') return { label: 'জরুরি সতর্কবার্তা পাঠানো হয়েছে', tone: 'red', icon: Siren };
    if (hasCheckedIn) return { label: 'আজ আপনি নিরাপদ আছেন', tone: 'teal', icon: ShieldCheck };
    return { label: 'আজকের খোঁজ এখনও জানানো হয়নি', tone: 'slate', icon: Clock3 };
  }, [alertStatus, hasCheckedIn]);

  const StatusIcon = status.icon;

  const renderOnboarding = () => (
    <section className="onboarding-wrap">
      <div className="onboarding-intro">
        <div className="onboarding-symbol"><HeartPulse size={31} /></div>
        <p className="eyebrow text-teal-700">প্রথমবারের পরিচয়</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">আপনার পাশে থাকতে<br />কিছু তথ্য জানাবেন?</h1>
        <p className="mt-3 text-[15px] leading-7 text-slate-600">শুধু আপনার নাম, ফোন এবং গ্রামের নাম লিখুন। আপনার তথ্য ব্যক্তিগত থাকবে এবং পরে বদলানো যাবে।</p>
      </div>
      <form className="onboarding-form" onSubmit={completeOnboarding}>
        <label className="form-field"><span>আপনার নাম <b>*</b></span><input value={onboardingValues.displayName} onChange={(event) => setOnboardingValues((previous) => ({ ...previous, displayName: event.target.value }))} placeholder="যেমন: সরস্বতী দেবী" autoComplete="name" /></label>
        <label className="form-field"><span>ফোন নম্বর <b>*</b></span><input value={onboardingValues.phone} onChange={(event) => setOnboardingValues((previous) => ({ ...previous, phone: event.target.value }))} placeholder="১০ অঙ্কের ফোন নম্বর" inputMode="tel" autoComplete="tel" /></label>
        <label className="form-field"><span>গ্রামের নাম <b>*</b></span><input value={onboardingValues.villageName} onChange={(event) => setOnboardingValues((previous) => ({ ...previous, villageName: event.target.value }))} placeholder="যেমন: কাশিমপুর" /></label>
        <label className="form-field"><span>ওয়ার্ড নম্বর <em>ঐচ্ছিক</em></span><input value={onboardingValues.wardNumber} onChange={(event) => setOnboardingValues((previous) => ({ ...previous, wardNumber: event.target.value }))} placeholder="যেমন: ৭" inputMode="numeric" /></label>
        <div className="onboarding-consent"><ShieldCheck size={19} /><span>আপনার তথ্য শুধু নিরাপত্তা ও সহায়তার কাজে ব্যবহার করা হবে।</span></div>
        <button className="onboarding-submit" type="submit"><span>শুরু করি</span><ChevronRight size={21} /></button>
      </form>
    </section>
  );

  const renderHome = () => (
    <>
      <section className="hero-card">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow text-teal-100">আজকের খোঁজ</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">নমস্কার, {elderName}</h2>
              <p className="mt-2 text-base text-teal-50/80">আপনি একা নন—আমরা আপনার পাশে আছি।</p>
            </div>
            <div className="avatar-mark" aria-hidden="true">{elderInitial}</div>
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-teal-50 ring-1 ring-white/10">
            <MapPin size={17} />
            <span>{profile?.villageName || 'গাজোল'}{profile?.wardNumber ? ` • ওয়ার্ড ${profile.wardNumber}` : ''}, মালদা</span>
            <span className="ml-auto text-teal-100/70">সহায়ক: {buddy.name}</span>
          </div>
        </div>
      </section>

      <section className="status-panel -mt-7 relative z-20">
        <div className={`status-icon status-${status.tone}`}><StatusIcon size={24} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">আপনার নিরাপত্তার অবস্থা</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{status.label}</p>
          <p className="mt-1 text-sm text-slate-500">
            {hasCheckedIn ? `আজ ${formatTime(data.checkin.timestamp)}-এ জানানো হয়েছে` : 'সন্ধ্যা ৬টার আগে একবার জানিয়ে দিন'}
          </p>
        </div>
        <span className={`status-dot status-dot-${status.tone}`} aria-label="status" />
      </section>

      <section className="checkin-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow text-teal-700">একটি ট্যাপেই</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">আজ ভালো আছি</h3>
          </div>
          <CalendarCheck2 className="text-saffron-500" size={30} />
        </div>
        <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">আপনি ভালো আছেন জানালে আপনার সহায়ক {buddy.name} বুঝতে পারবেন যে আজ আপনার খবর নেওয়া হয়ে গেছে।</p>
        <button className={`checkin-button ${hasCheckedIn ? 'checked' : ''}`} onClick={checkIn} aria-label="আজ ভালো আছি জানাতে চাপুন">
          <span className="checkin-button-icon"><Check size={31} strokeWidth={3} /></span>
          <span>{hasCheckedIn ? 'আজকের খোঁজ জানানো হয়েছে' : 'চাপুন: আমি ভালো আছি'}</span>
        </button>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400"><Clock3 size={14} /> প্রতিদিন সন্ধ্যা ৬টার মধ্যে</div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button className="quick-action quick-action-sos" onClick={() => setModal('sos')}>
          <span className="quick-icon"><LifeBuoy size={24} /></span>
          <span className="text-left"><strong>SOS সাহায্য</strong><small>জরুরি সহায়তা</small></span>
          <ChevronRight className="ml-auto" size={20} />
        </button>
        <button className="quick-action quick-action-ambulance" onClick={() => setModal('ambulance')}>
          <span className="quick-icon"><Ambulance size={24} /></span>
          <span className="text-left"><strong>অ্যাম্বুলেন্স</strong><small>১০৮-এর জন্য</small></span>
          <ChevronRight className="ml-auto" size={20} />
        </button>
      </section>

      <section className="voice-card">
        <div className="voice-card-copy">
          <div className="flex items-center gap-2"><span className="voice-pulse" /><p className="eyebrow text-saffron-700">কথা বলে জানান</p></div>
          <h3 className="mt-2 text-xl font-bold text-slate-900">বলুন, আপনার কী সমস্যা?</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">বাংলায় বলুন—এই সুবিধাটি এখন পরীক্ষামূলক।</p>
          {transcript && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm">“{transcript}”</p>}
        </div>
        <button className={`voice-button ${isListening ? 'listening' : ''}`} onClick={toggleVoice} aria-label={isListening ? 'শোনা বন্ধ করুন' : 'কথা বলুন'}>
          {isListening ? <MicOff size={27} /> : <Mic size={27} />}
        </button>
      </section>
    </>
  );

  const renderActivity = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">আপনার রেকর্ড</p><h2 className="mt-1 text-3xl font-bold text-slate-900">কার্যকলাপ</h2><p className="mt-2 text-sm leading-6 text-slate-500">আপনার check-in এবং নিরাপত্তা সতর্কবার্তার সাম্প্রতিক তথ্য।</p></div>
      <div className="info-card flex items-start gap-4"><div className="mini-icon mini-icon-teal"><ShieldCheck size={22} /></div><div><p className="font-bold text-slate-900">আজকের check-in</p><p className="mt-1 text-sm text-slate-500">{hasCheckedIn ? `${formatDate(data.checkin.timestamp)}, ${formatTime(data.checkin.timestamp)}` : 'আজ এখনও check-in করা হয়নি'}</p><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${hasCheckedIn ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{hasCheckedIn ? 'সম্পন্ন' : 'অপেক্ষায়'}</span></div></div>
      {data.alert && <div className="info-card flex items-start gap-4"><div className={`mini-icon ${data.alert.status === 'family_escalated' ? 'mini-icon-red' : data.alert.status === 'buddy_acknowledged' ? 'mini-icon-teal' : 'mini-icon-amber'}`}><BellRing size={22} /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">সহায়কের সতর্কবার্তা</p><p className="mt-1 text-sm text-slate-500">{formatDate(data.alert.createdAt)} • {formatTime(data.alert.createdAt)}</p><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${data.alert.status === 'buddy_acknowledged' ? 'bg-teal-50 text-teal-700' : data.alert.status === 'family_escalated' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{data.alert.status === 'buddy_acknowledged' ? 'সহায়ক খবর নিয়েছেন' : data.alert.status === 'family_escalated' ? 'পরিবারকে জানানো হয়েছে' : 'সহায়কের উত্তর অপেক্ষায়'}</span>{data.alert.status === 'family_escalated' && <p className="mt-2 text-xs font-semibold text-red-700">{familyContact.name} ({familyContact.relationship})-কে সতর্ক করা হয়েছে।</p>}</div></div>}
      {data.emergencyLog.length > 0 && <div className="info-card"><div className="flex items-center gap-3"><div className="mini-icon mini-icon-red"><Siren size={22} /></div><div><p className="font-bold text-slate-900">জরুরি সতর্কবার্তা</p><p className="mt-1 text-sm text-slate-500">সর্বশেষ {formatTime(data.emergencyLog[0].createdAt)} • {data.emergencyLog[0].type === 'sos' ? 'SOS' : 'অ্যাম্বুলেন্স'}</p></div></div></div>}
      <div className="test-card"><div className="flex items-start gap-3"><div className="mini-icon mini-icon-slate"><RefreshCw size={21} /></div><div><p className="font-bold text-slate-900">পরীক্ষার জন্য buddy alert</p><p className="mt-1 text-sm leading-6 text-slate-500">{buddy.name}-এর উত্তর না এলে পরিবারের সদস্যকে সতর্ক করার flow যাচাই করুন।</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button className="secondary-button" onClick={simulateMissedCheckIn}>মিসড check-in দেখুন</button>{data.alert?.status === 'awaiting_buddy' && <><button className="primary-small-button" onClick={acknowledgeBuddy}>সহায়ক উত্তর দিয়েছেন</button><button className="escalate-button" onClick={escalateToFamily}>পরিবারকে জানান</button></>}{data.alert?.status === 'family_escalated' && <button className="secondary-button" onClick={acknowledgeBuddy}>সহায়ক পরে উত্তর দিয়েছেন</button>}</div></div>
    </section>
  );

  const renderProfile = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">আপনার পরিচয়</p><h2 className="mt-1 text-3xl font-bold text-slate-900">প্রোফাইল</h2></div>
      <div className="profile-card"><div className="profile-avatar">{elderInitial}</div><div><h3 className="text-xl font-bold text-slate-900">{elderName}</h3><p className="mt-1 text-sm text-slate-500">Elder profile • Gazole, Malda</p></div><button className="icon-button ml-auto" aria-label="প্রোফাইল তথ্য"><Info size={19} /></button></div>
      <div className="info-card buddy-profile-card"><div className="buddy-avatar">{buddy.name.trim().charAt(0) || 'মি'}</div><div className="flex-1"><p className="eyebrow text-slate-400">আমার পাশে আছেন</p><p className="mt-2 font-bold text-slate-900">{buddy.name}</p><p className="mt-1 text-sm text-slate-500">{buddy.type} • {buddy.phone}</p></div><div className="buddy-card-actions"><a href={`tel:${buddy.phone}`} className="call-button" aria-label={`${buddy.name}-কে কল করুন`}><Phone size={19} /></a><button className="edit-buddy-button" onClick={openBuddyEditor}>বদলান</button></div></div>
      <div className="privacy-note"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-700" /><p><strong>আপনার তথ্য ব্যক্তিগত।</strong><br />শুধু আপনার সহায়ক ও নিবন্ধিত পরিবারের সদস্যরা আপনার নিরাপত্তার খবর দেখতে পারবেন।</p></div>
      <div className="info-card flex items-center gap-3"><div className={`mini-icon ${isOnline ? 'mini-icon-teal' : 'mini-icon-amber'}`}>{isOnline ? <Wifi size={21} /> : <WifiOff size={21} />}</div><div><p className="font-bold text-slate-900">সংযোগের অবস্থা</p><p className="mt-1 text-sm text-slate-500">{isOnline ? 'ইন্টারনেট সংযুক্ত' : 'অফলাইন • তথ্য ফোনে রাখা হচ্ছে'}</p></div></div>
    </section>
  );

  return (
    <div className="app-background">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-lockup"><div className="brand-mark"><HeartPulse size={22} strokeWidth={2.4} /></div><div><p className="brand-name">সংকেত স্নেহ</p><p className="brand-subtitle">Sanket Sneho</p></div></div>
          <div className="topbar-actions"><span className={`connection-pill ${isOnline ? 'online' : 'offline'}`}>{isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}{isOnline ? 'অনলাইন' : 'অফলাইন'}</span><button className="profile-chip" onClick={() => setTab('profile')} aria-label="প্রোফাইল খুলুন"><CircleUserRound size={22} /></button></div>
        </header>

        <main className={`main-content ${!profile ? 'onboarding-content' : ''}`}>
          {!profile && renderOnboarding()}
          {profile && tab === 'home' && renderHome()}
          {profile && tab === 'activity' && renderActivity()}
          {profile && tab === 'profile' && renderProfile()}
        </main>

        {profile && <nav className="bottom-nav" aria-label="প্রধান নেভিগেশন">
          {[['home', Home, 'হোম'], ['activity', Activity, 'কার্যকলাপ'], ['profile', CircleUserRound, 'প্রোফাইল']].map(([id, Icon, label]) => <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}><Icon size={22} /><span>{label}</span></button>)}
        </nav>}

        <footer className="app-footer"><span>{APP_VERSION}</span><span className="footer-divider" /><span>গাজোল পাইলট</span></footer>
      </div>

      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}

      {assignmentOpen && <div className="modal-backdrop" role="presentation" onClick={() => setAssignmentOpen(false)}><form className="modal-card assignment-modal" onSubmit={saveBuddyAssignment} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setAssignmentOpen(false)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol modal-symbol-teal"><UsersRound size={30} /></div><p className="eyebrow mt-5 text-teal-700">সহায়ক assignment</p><h2 className="mt-2 text-2xl font-bold text-slate-900">আপনার সহায়ক বদলান</h2><p className="mt-3 text-sm leading-6 text-slate-600">যিনি নিয়মিত আপনার খবর নিতে পারবেন, তাঁর তথ্য এখানে রাখুন।</p><label className="modal-form-field"><span>সহায়কের নাম</span><input value={buddyValues.name} onChange={(event) => setBuddyValues((previous) => ({ ...previous, name: event.target.value }))} placeholder="যেমন: মিতালি দাস" /></label><label className="modal-form-field"><span>ফোন নম্বর</span><input value={buddyValues.phone} onChange={(event) => setBuddyValues((previous) => ({ ...previous, phone: event.target.value }))} placeholder="১০ অঙ্কের ফোন নম্বর" inputMode="tel" /></label><label className="modal-form-field"><span>সহায়কের ধরন</span><select value={buddyValues.type} onChange={(event) => setBuddyValues((previous) => ({ ...previous, type: event.target.value }))}><option>ASHA সহায়ক</option><option>Anganwadi কর্মী</option><option>স্থানীয় volunteer</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setAssignmentOpen(false)}>এখন নয়</button><button type="submit" className="primary-small-button">তথ্য রাখুন</button></div></form></div>}

      {modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}><div className={`modal-card ${modal === 'ambulance' ? 'modal-amber' : 'modal-red'}`} role="dialog" aria-modal="true" aria-labelledby="emergency-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol">{modal === 'ambulance' ? <Ambulance size={32} /> : <LifeBuoy size={32} />}</div><p className="eyebrow mt-5">জরুরি সাহায্য</p><h2 id="emergency-title" className="mt-2 text-2xl font-bold text-slate-900">{modal === 'ambulance' ? 'অ্যাম্বুলেন্স প্রয়োজন?' : 'আপনার কি এখনই সাহায্য দরকার?'}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{modal === 'ambulance' ? 'এই flow-টি আপনার সহায়ক ও পরিবারকে জানাবে। এরপর আপনি ১০৮-এ ফোন করার সুযোগ পাবেন।' : 'আপনার সহায়ক এবং নিবন্ধিত পরিবারের সদস্যদের সতর্কবার্তা পাঠানো হবে।'}</p><div className="location-note"><LocateFixed size={18} /><span>{isOnline ? 'GPS অবস্থান পাওয়া গেলে সতর্কবার্তার সঙ্গে যাবে' : 'অফলাইন—GPS না গেলে ফোনে সাহায্য নিন'}</span></div><div className="modal-actions"><button className="secondary-button" onClick={() => setModal(null)}>এখন নয়</button><button className="danger-button" onClick={() => sendEmergency(modal)}>{modal === 'ambulance' ? 'সতর্ক করে ১০৮ দেখান' : 'সাহায্য পাঠান'}</button></div>{modal === 'ambulance' && <a className="call-108-link" href="tel:108"><Phone size={17} /> ১০৮-এ ফোন করুন</a>}</div></div>}
    </div>
  );
}

export default App;
