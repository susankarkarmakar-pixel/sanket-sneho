import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlarmClock,
  Ambulance,
  Bell,
  BellRing,
  CalendarCheck2,
  Check,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  CloudOff,
  CloudUpload,
  Clock3,
  Frown,
  FileText,
  HeartPulse,
  Home,
  Info,
  LifeBuoy,
  LocateFixed,
  MapPin,
  Meh,
  Mic,
  MicOff,
  Phone,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Smile,
  Thermometer,
  UserPlus,
  UsersRound,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'sanket-sneho-phase1';
const APP_VERSION = 'Phase 1 • Test mode';

const emptyHealthForm = {
  mood: '',
  sleep: '',
  appetite: '',
  medicine: '',
  temperature: '',
  pulse: '',
  systolic: '',
  diastolic: '',
  note: '',
};

const moodOptions = [
  { value: 'good', label: 'ভালো', hint: 'মন ভালো আছে', icon: Smile },
  { value: 'okay', label: 'মোটামুটি', hint: 'সামান্য অস্বস্তি', icon: Meh },
  { value: 'low', label: 'মন খারাপ', hint: 'কারও সঙ্গে বলুন', icon: Frown },
];

const defaultData = {
  profile: null,
  buddy: { name: 'মিতালি দাস', phone: '9830012345', type: 'ASHA সহায়ক' },
  familyContact: { name: 'রাহুল দেবী', relationship: 'ছেলে', phone: '9000012345' },
  checkin: null,
  alert: null,
  emergencyAlert: null,
  emergencyLog: [],
  syncQueue: [],
  lastSyncAt: null,
  notificationSettings: { enabled: false, mode: 'in_app', time: '18:00' },
  emergencyContacts: [
    { id: 'contact-buddy', name: 'মিতালি দাস', relationship: 'সহায়ক', phone: '9830012345', priority: 'primary', canReceiveSOS: true },
    { id: 'contact-son', name: 'রাহুল দেবী', relationship: 'ছেলে', phone: '9000012345', priority: 'primary', canReceiveSOS: true },
  ],
  healthLogs: [],
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
  const [emergencySending, setEmergencySending] = useState(false);
  const [healthValues, setHealthValues] = useState(emptyHealthForm);
  const [contactOpen, setContactOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reminderNotice, setReminderNotice] = useState('');
  const [contactValues, setContactValues] = useState({ name: '', relationship: '', phone: '', priority: 'primary' });
  const [onboardingValues, setOnboardingValues] = useState({ displayName: '', phone: '', villageName: '', wardNumber: '' });
  const [buddyValues, setBuddyValues] = useState({ name: '', phone: '', type: 'ASHA সহায়ক' });
  const recognitionRef = useRef(null);
  const profile = data.profile || null;
  const buddy = data.buddy || defaultData.buddy;
  const familyContact = data.familyContact || defaultData.familyContact;
  const emergencyContacts = data.emergencyContacts || defaultData.emergencyContacts;
  const healthLogs = data.healthLogs || defaultData.healthLogs;
  const latestHealthLog = healthLogs[0] || null;
  const notificationSettings = data.notificationSettings || defaultData.notificationSettings;
  const pendingSyncCount = (data.syncQueue || []).length;
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
      setData((previous) => ({
        ...previous,
        syncQueue: [],
        lastSyncAt: new Date().toISOString(),
        checkin: previous.checkin ? { ...previous.checkin, syncState: 'synced' } : previous.checkin,
        healthLogs: (previous.healthLogs || []).map((log) => ({ ...log, syncState: 'synced' })),
      }));
      showToast('ইন্টারনেট ফিরে এসেছে। ফোনে রাখা তথ্য সিঙ্ক হয়েছে।');
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

  useEffect(() => {
    const checkReminder = () => {
      if (!notificationSettings.enabled || hasCheckedIn) return;
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime !== notificationSettings.time || notificationSettings.lastTriggeredOn === todayKey) return;
      const message = 'সন্ধ্যা ৬টার আগে আজকের খোঁজ জানিয়ে দিন।';
      if (notificationSettings.mode === 'browser' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Sanket Sneho — আজকের খোঁজ', { body: message, icon: '/favicon.svg' });
      } else {
        setReminderNotice(message);
        window.setTimeout(() => setReminderNotice(''), 6000);
      }
      setData((previous) => ({ ...previous, notificationSettings: { ...(previous.notificationSettings || defaultData.notificationSettings), lastTriggeredOn: todayKey } }));
    };
    checkReminder();
    const reminderTimer = window.setInterval(checkReminder, 30000);
    return () => window.clearInterval(reminderTimer);
  }, [hasCheckedIn, notificationSettings.enabled, notificationSettings.lastTriggeredOn, notificationSettings.mode, notificationSettings.time]);

  const enqueueOffline = (previous, entity, createdAt) => ({
    ...previous,
    syncQueue: isOnline ? (previous.syncQueue || []) : [...(previous.syncQueue || []), { id: `sync-${entity}-${Date.now()}`, entity, createdAt, status: 'waiting' }],
  });

  const enableLocalReminder = () => {
    setData((previous) => ({ ...previous, notificationSettings: { ...(previous.notificationSettings || defaultData.notificationSettings), enabled: true, mode: 'in_app', time: '18:00' } }));
    showToast('In-app reminder চালু হয়েছে।');
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setData((previous) => ({ ...previous, notificationSettings: { ...(previous.notificationSettings || defaultData.notificationSettings), enabled: true, mode: 'browser', time: '18:00' } }));
          showToast('Browser notification-ও চালু হয়েছে।');
        }
      }).catch(() => {});
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setData((previous) => ({ ...previous, notificationSettings: { ...(previous.notificationSettings || defaultData.notificationSettings), enabled: true, mode: 'browser', time: '18:00' } }));
    }
  };

  const disableLocalReminder = () => {
    setData((previous) => ({ ...previous, notificationSettings: { ...(previous.notificationSettings || defaultData.notificationSettings), enabled: false } }));
    setReminderNotice('Reminder বন্ধ করা হয়েছে।');
    window.setTimeout(() => setReminderNotice(''), 3000);
  };

  const previewLocalReminder = () => {
    const message = 'সন্ধ্যা ৬টার আগে আজকের খোঁজ জানিয়ে দিন।';
    if (notificationSettings.mode === 'browser' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Sanket Sneho — reminder test', { body: message, icon: '/favicon.svg' });
      showToast('Browser notification test পাঠানো হয়েছে।');
    } else {
      setReminderNotice(message);
      window.setTimeout(() => setReminderNotice(''), 6000);
    }
  };

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

  const toggleHealthRoutine = (field) => {
    setHealthValues((previous) => ({ ...previous, [field]: previous[field] === 'yes' ? '' : 'yes' }));
  };

  const saveHealthLog = (event) => {
    event.preventDefault();
    if (!healthValues.mood) {
      showToast('আজ মন কেমন আছে—একটি option বেছে নিন।');
      return;
    }
    const numericLimits = {
      temperature: [30, 45],
      pulse: [30, 220],
      systolic: [50, 250],
      diastolic: [30, 150],
    };
    for (const [field, [minimum, maximum]] of Object.entries(numericLimits)) {
      if (healthValues[field] && (!Number.isFinite(Number(healthValues[field])) || Number(healthValues[field]) < minimum || Number(healthValues[field]) > maximum)) {
        showToast('ভাইটাল তথ্যের সংখ্যাটি আবার দেখে লিখুন।');
        return;
      }
    }
    const mood = moodOptions.find((option) => option.value === healthValues.mood);
    const log = {
      id: `health-${Date.now()}`,
      createdAt: new Date().toISOString(),
      syncState: isOnline ? 'synced' : 'waiting_to_sync',
      mood: healthValues.mood,
      moodLabel: mood?.label || 'নথিভুক্ত',
      sleep: healthValues.sleep,
      appetite: healthValues.appetite,
      medicine: healthValues.medicine,
      temperature: healthValues.temperature,
      pulse: healthValues.pulse,
      systolic: healthValues.systolic,
      diastolic: healthValues.diastolic,
      note: healthValues.note.trim(),
    };
    setData((previous) => enqueueOffline({ ...previous, healthLogs: [log, ...(previous.healthLogs || [])].slice(0, 14) }, 'health-log', log.createdAt));
    setHealthValues(emptyHealthForm);
    showToast(isOnline ? 'আজকের স্বাস্থ্য-খোঁজ রাখা হয়েছে।' : 'স্বাস্থ্য-খোঁজ ফোনে রাখা হয়েছে—ইন্টারনেট এলে সিঙ্ক হবে।');
  };

  const checkIn = () => {
    const timestamp = new Date().toISOString();
    setData((previous) => enqueueOffline({
      ...previous,
      checkin: { timestamp, syncState: isOnline ? 'synced' : 'waiting_to_sync' },
      alert: null,
    }, 'checkin', timestamp));
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
    const updatedAt = new Date().toISOString();
    setData((previous) => enqueueOffline({ ...previous, buddy: { ...cleaned, assignedAt: updatedAt }, emergencyContacts: (previous.emergencyContacts || []).map((contact) => contact.relationship === 'সহায়ক' ? { ...contact, name: cleaned.name, phone: cleaned.phone } : contact) }, 'buddy', updatedAt));
    setAssignmentOpen(false);
    showToast(`${cleaned.name}-কে আপনার সহায়ক হিসেবে রাখা হয়েছে।`);
  };

  const openContactEditor = () => {
    setContactValues({ name: '', relationship: '', phone: '', priority: 'secondary' });
    setContactOpen(true);
  };

  const saveEmergencyContact = (event) => {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(contactValues).map(([key, value]) => [key, value.trim()]));
    if (!cleaned.name || !cleaned.relationship || !cleaned.phone) {
      showToast('নাম, সম্পর্ক এবং ফোন নম্বর লিখুন।');
      return;
    }
    const newContact = { ...cleaned, id: `contact-${Date.now()}`, canReceiveSOS: true };
    setData((previous) => enqueueOffline({ ...previous, emergencyContacts: [...(previous.emergencyContacts || []), newContact] }, 'emergency-contact', newContact.id));
    setContactOpen(false);
    showToast(`${cleaned.name}-কে emergency contact হিসেবে রাখা হয়েছে।`);
  };

  const removeEmergencyContact = (contactId) => {
    setData((previous) => enqueueOffline({ ...previous, emergencyContacts: (previous.emergencyContacts || []).filter((contact) => contact.id !== contactId) }, 'emergency-contact-remove', contactId));
    showToast('Emergency contact সরানো হয়েছে।');
  };

  const healthReport = useMemo(() => {
    const reportLines = [
      'SANKET SNEHO — HEALTH SUMMARY (TEST MODE)',
      'স্বাস্থ্য summary • এটি diagnosis বা treatment advice নয়',
      '',
      `ব্যবহারকারী: ${elderName}`,
      `গ্রাম: ${profile?.villageName || 'নথিভুক্ত নয়'}`,
      `সহায়ক: ${buddy.name} • ${buddy.phone}`,
      `নথি তৈরির সময়: ${formatDate(new Date().toISOString())}, ${formatTime(new Date().toISOString())}`,
      `মোট record: ${healthLogs.length}টি`,
      '',
      'সাম্প্রতিক record:',
    ];
    if (healthLogs.length === 0) reportLines.push('কোনো health record এখনও রাখা হয়নি।');
    healthLogs.slice(0, 14).forEach((log, index) => {
      const routine = [log.sleep === 'yes' && 'ঘুম', log.appetite === 'yes' && 'খাবার', log.medicine === 'yes' && 'ওষুধ'].filter(Boolean).join(' • ') || 'routine record নেই';
      const vitals = [log.temperature && `তাপমাত্রা ${log.temperature}°C`, log.pulse && `pulse ${log.pulse}`, log.systolic && log.diastolic && `BP ${log.systolic}/${log.diastolic}`].filter(Boolean).join(' • ') || 'optional vitals নেই';
      reportLines.push(`${index + 1}. ${formatDate(log.createdAt)} • mood: ${log.moodLabel}`);
      reportLines.push(`   routine: ${routine}`);
      reportLines.push(`   মাপ: ${vitals}`);
      if (log.note) reportLines.push(`   নোট: ${log.note}`);
    });
    reportLines.push('', 'নোট: এই report ব্যবহারকারীর নিজস্ব entry-র সারাংশ। গুরুত্বপূর্ণ স্বাস্থ্য সিদ্ধান্তের জন্য qualified clinician-এর সঙ্গে কথা বলুন।');
    return reportLines.join('\n');
  }, [buddy.name, buddy.phone, elderName, healthLogs, profile?.villageName]);

  const downloadHealthReport = () => {
    const blob = new Blob([healthReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sanket-sneho-health-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast('Health summary report download শুরু হয়েছে।');
  };

  const commitEmergencyAlert = (type, location) => {
    const sentAt = new Date().toISOString();
    const recipients = (emergencyContacts.filter((contact) => contact.canReceiveSOS !== false).length > 0 ? emergencyContacts.filter((contact) => contact.canReceiveSOS !== false) : [
      { relationship: 'সহায়ক', name: buddy.name, phone: buddy.phone },
      { relationship: familyContact.relationship, name: familyContact.name, phone: familyContact.phone },
    ]).map((contact) => ({ role: contact.relationship === 'সহায়ক' ? 'buddy' : 'family', name: contact.name, phone: contact.phone, status: 'sent' }));
    const entry = {
      id: `${type}-${Date.now()}`,
      type,
      createdAt: sentAt,
      syncState: isOnline ? 'synced' : 'waiting_to_sync',
      locationState: location.state,
      coordinates: location.coordinates || null,
      recipients,
    };
    setData((previous) => enqueueOffline({
      ...previous,
      emergencyAlert: { ...entry, status: 'sent', acknowledgedBy: [] },
      emergencyLog: [entry, ...previous.emergencyLog].slice(0, 8),
      alert: { type, status: 'sent', createdAt: sentAt },
    }, 'emergency-alert', sentAt));
    setEmergencySending(false);
    setModal(null);
    showToast(type === 'sos' ? 'SOS alert মিতালি দি ও পরিবারকে পাঠানো হয়েছে।' : 'অ্যাম্বুলেন্সের alert প্রস্তুত হয়েছে।');
  };

  const sendEmergency = (type) => {
    setEmergencySending(true);
    if (!navigator.geolocation) {
      commitEmergencyAlert(type, { state: 'unavailable' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => commitEmergencyAlert(type, {
        state: 'shared',
        coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude },
      }),
      () => commitEmergencyAlert(type, { state: 'not_shared' }),
      { enableHighAccuracy: false, timeout: 2500, maximumAge: 30000 },
    );
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

      <section className="health-preview-card">
        <div className="flex min-w-0 items-start gap-3"><div className="health-preview-icon"><HeartPulse size={22} /></div><div className="min-w-0"><p className="eyebrow text-teal-700">শরীর ও মন</p><h3 className="mt-1 text-xl font-bold text-slate-900">আজ কেমন আছেন?</h3><p className="mt-1 truncate text-sm text-slate-500">{latestHealthLog ? `আজ ${latestHealthLog.moodLabel} অনুভব করছেন` : 'প্রতিদিনের ছোট্ট স্বাস্থ্য-খোঁজ লিখুন'}</p></div></div><button className="health-open-button" onClick={() => setTab('health')} aria-label="স্বাস্থ্য check-in খুলুন"><HeartPulse size={19} /><span>লগ করুন</span></button>
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

  const renderHealth = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">প্রতিদিনের স্বাস্থ্য-খোঁজ</p><h2 className="mt-1 text-3xl font-bold text-slate-900">শরীর ও মন</h2><p className="mt-2 text-sm leading-6 text-slate-500">আজ আপনার mood, routine এবং optional vital তথ্য লিখে রাখুন।</p></div>
      <div className="health-safety-note"><ShieldCheck size={19} /><p><strong>এটি শুধু আপনার record।</strong><br />এই app কোনো diagnosis বা treatment advice দেয় না। কোনো অসুবিধা হলে qualified clinician-এর সাহায্য নিন।</p></div>
      <form className="health-form" onSubmit={saveHealthLog}>
        <div className="health-form-section"><div className="health-section-heading"><div><p className="eyebrow text-saffron-700">১ • মনের অবস্থা</p><h3 className="mt-1 text-lg font-bold text-slate-900">আজ মন কেমন?</h3></div><HeartPulse className="text-saffron-500" size={25} /></div><div className="mood-grid">{moodOptions.map(({ value, label, hint, icon: Icon }) => <button key={value} type="button" className={`mood-option mood-${value} ${healthValues.mood === value ? 'selected' : ''}`} onClick={() => setHealthValues((previous) => ({ ...previous, mood: value }))}><Icon size={27} /><strong>{label}</strong><small>{hint}</small></button>)}</div></div>
        <div className="health-form-section"><div className="health-section-heading"><div><p className="eyebrow text-teal-700">২ • routine check</p><h3 className="mt-1 text-lg font-bold text-slate-900">আজকের যত্ন</h3></div><Check className="text-teal-500" size={25} /></div><div className="routine-grid">{[['sleep', 'ভালো ঘুম হয়েছে'], ['appetite', 'খাবার খেয়েছি'], ['medicine', 'নিয়মিত ওষুধ নিয়েছি']].map(([field, label]) => <button key={field} type="button" className={`routine-option ${healthValues[field] === 'yes' ? 'selected' : ''}`} onClick={() => toggleHealthRoutine(field)}><span className="routine-check">{healthValues[field] === 'yes' ? <Check size={17} /> : null}</span><span>{label}</span></button>)}</div></div>
        <div className="health-form-section"><div className="health-section-heading"><div><p className="eyebrow text-teal-700">৩ • optional vitals</p><h3 className="mt-1 text-lg font-bold text-slate-900">আজকের মাপ (ইচ্ছা হলে)</h3></div><Thermometer className="text-teal-500" size={25} /></div><p className="vitals-helper">যন্ত্রে মাপা থাকলে শুধু record করুন—app ফলাফল ব্যাখ্যা করছে না।</p><div className="vitals-grid"><label className="vital-field"><span>তাপমাত্রা (°C)</span><input value={healthValues.temperature} onChange={(event) => setHealthValues((previous) => ({ ...previous, temperature: event.target.value }))} placeholder="যেমন 36.8" inputMode="decimal" /></label><label className="vital-field"><span>Pulse / মিনিট</span><input value={healthValues.pulse} onChange={(event) => setHealthValues((previous) => ({ ...previous, pulse: event.target.value }))} placeholder="যেমন 72" inputMode="numeric" /></label><label className="vital-field"><span>BP উপরে</span><input value={healthValues.systolic} onChange={(event) => setHealthValues((previous) => ({ ...previous, systolic: event.target.value }))} placeholder="যেমন 120" inputMode="numeric" /></label><label className="vital-field"><span>BP নিচে</span><input value={healthValues.diastolic} onChange={(event) => setHealthValues((previous) => ({ ...previous, diastolic: event.target.value }))} placeholder="যেমন 80" inputMode="numeric" /></label></div></div>
        <label className="health-note-field"><span>আজকের ছোট্ট নোট <em>ঐচ্ছিক</em></span><textarea value={healthValues.note} onChange={(event) => setHealthValues((previous) => ({ ...previous, note: event.target.value }))} placeholder="যেমন: সকালে একটু হাঁটলাম" rows="3" /></label>
        <button type="submit" className="health-save-button"><Check size={20} /> আজকের স্বাস্থ্য-খোঁজ রাখুন</button>
      </form>
      <div className="health-history"><div className="section-heading"><div><p className="eyebrow text-teal-700">আপনার record</p><h3 className="mt-1 text-xl font-bold text-slate-900">সাম্প্রতিক স্বাস্থ্য-খোঁজ</h3></div><span className="history-count">{healthLogs.length}টি</span></div>{healthLogs.length === 0 ? <div className="empty-health-state"><HeartPulse size={22} /><p>এখনও কোনো স্বাস্থ্য-খোঁজ রাখা হয়নি। আজকের mood দিয়ে শুরু করুন।</p></div> : <div className="health-history-list">{healthLogs.slice(0, 5).map((log) => <div className="health-history-item" key={log.id}><div className={`history-mood history-mood-${log.mood}`}><HeartPulse size={17} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong>{log.moodLabel}</strong><time>{formatDate(log.createdAt)}</time></div><p>{[log.sleep === 'yes' && 'ঘুম', log.appetite === 'yes' && 'খাবার', log.medicine === 'yes' && 'ওষুধ'].filter(Boolean).join(' • ') || 'routine record নেই'}</p>{(log.temperature || log.pulse || log.systolic || log.diastolic) && <small>মাপ রাখা হয়েছে: {[log.temperature && `${log.temperature}°C`, log.pulse && `pulse ${log.pulse}`, log.systolic && log.diastolic && `BP ${log.systolic}/${log.diastolic}`].filter(Boolean).join(' • ')}</small>}</div></div>)}</div>}</div>
    </section>
  );

  const renderFamily = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">সহযোগী dashboard</p><h2 className="mt-1 text-3xl font-bold text-slate-900">পরিবারের জন্য</h2><p className="mt-2 text-sm leading-6 text-slate-500">{elderName}-এর নিরাপত্তা ও wellness record এক জায়গায় দেখুন।</p></div>
      <div className="family-dashboard-hero"><div className="family-hero-icon"><UsersRound size={24} /></div><div className="min-w-0 flex-1"><p className="eyebrow text-teal-100">বর্তমান safety status</p><h3 className="mt-1 text-xl font-bold text-white">{data.alert?.status === 'family_escalated' ? 'পরিবারকে সতর্ক করা হয়েছে' : data.emergencyAlert?.status === 'sent' ? 'জরুরি alert পাঠানো হয়েছে' : hasCheckedIn ? 'আজকের check-in সম্পন্ন' : 'আজকের check-in অপেক্ষায়'}</h3><p className="mt-1 text-sm text-teal-50/80">{hasCheckedIn ? `শেষ check-in: ${formatTime(data.checkin.timestamp)}` : 'সন্ধ্যা ৬টার আগে elder-এর খবর নিন'}</p></div><span className="family-live-pill"><span /> live view</span></div>
      <div className="family-glance-grid"><div className="family-glance-card"><div className="mini-icon mini-icon-teal"><HeartPulse size={20} /></div><span>আজকের mood</span><strong>{latestHealthLog?.moodLabel || 'এখনও লেখা হয়নি'}</strong></div><div className="family-glance-card"><div className="mini-icon mini-icon-amber"><ClipboardList size={20} /></div><span>health records</span><strong>{healthLogs.length}টি</strong></div></div>
      <div className="family-alert-card"><div className="mini-icon mini-icon-red"><ShieldAlert size={21} /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">সর্বশেষ নিরাপত্তা update</p><p className="mt-1 text-sm leading-6 text-slate-600">{data.emergencyAlert?.status === 'sent' ? `SOS alert ${formatTime(data.emergencyAlert.createdAt)}-এ ${data.emergencyAlert.recipients.length} জন contact-কে পাঠানো হয়েছে।` : data.alert?.status === 'family_escalated' ? `${familyContact.name}-এর কাছে family escalation পাঠানো হয়েছে।` : 'কোনো নতুন emergency update নেই।'}</p></div></div>
      <div className="family-panel"><div className="section-heading"><div><p className="eyebrow text-teal-700">Emergency contacts</p><h3 className="mt-1 text-xl font-bold text-slate-900">কারা খবর পাবেন?</h3></div><button className="add-contact-button" onClick={openContactEditor}><UserPlus size={17} /> যোগ করুন</button></div><div className="contact-list">{emergencyContacts.map((contact) => <div className="contact-row" key={contact.id}><div className={`contact-avatar ${contact.relationship === 'সহায়ক' ? 'contact-avatar-teal' : 'contact-avatar-amber'}`}>{contact.name.trim().charAt(0) || 'ক'}</div><div className="min-w-0 flex-1"><strong>{contact.name}</strong><span>{contact.relationship} • {contact.phone}</span><small><ShieldCheck size={12} /> SOS alert পাবেন</small></div><div className="contact-actions"><a href={`tel:${contact.phone}`} className="call-button" aria-label={`${contact.name}-কে কল করুন`}><Phone size={17} /></a>{contact.priority !== 'primary' && <button className="remove-contact-button" onClick={() => removeEmergencyContact(contact.id)} aria-label={`${contact.name}-কে সরান`}><X size={16} /></button>}</div></div>)}</div></div>
      <div className="family-panel report-cta"><div className="report-icon"><FileText size={22} /></div><div className="min-w-0 flex-1"><p className="eyebrow text-teal-700">wellness summary</p><h3 className="mt-1 text-lg font-bold text-slate-900">Health summary report</h3><p className="mt-1 text-sm leading-6 text-slate-500">সাম্প্রতিক mood, routine এবং user-entered vitals-এর plain-text summary দেখুন বা download করুন।</p></div><button className="health-open-button" onClick={() => setReportOpen(true)}><FileText size={17} /><span>রিপোর্ট</span></button></div>
    </section>
  );

  const renderActivity = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">আপনার রেকর্ড</p><h2 className="mt-1 text-3xl font-bold text-slate-900">কার্যকলাপ</h2><p className="mt-2 text-sm leading-6 text-slate-500">আপনার check-in এবং নিরাপত্তা সতর্কবার্তার সাম্প্রতিক তথ্য।</p></div>
      <div className="info-card flex items-start gap-4"><div className="mini-icon mini-icon-teal"><ShieldCheck size={22} /></div><div><p className="font-bold text-slate-900">আজকের check-in</p><p className="mt-1 text-sm text-slate-500">{hasCheckedIn ? `${formatDate(data.checkin.timestamp)}, ${formatTime(data.checkin.timestamp)}` : 'আজ এখনও check-in করা হয়নি'}</p><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${hasCheckedIn ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{hasCheckedIn ? 'সম্পন্ন' : 'অপেক্ষায়'}</span></div></div>
      {data.alert && <div className="info-card flex items-start gap-4"><div className={`mini-icon ${data.alert.status === 'family_escalated' ? 'mini-icon-red' : data.alert.status === 'buddy_acknowledged' ? 'mini-icon-teal' : 'mini-icon-amber'}`}><BellRing size={22} /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">সহায়কের সতর্কবার্তা</p><p className="mt-1 text-sm text-slate-500">{formatDate(data.alert.createdAt)} • {formatTime(data.alert.createdAt)}</p><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${data.alert.status === 'buddy_acknowledged' ? 'bg-teal-50 text-teal-700' : data.alert.status === 'family_escalated' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{data.alert.status === 'buddy_acknowledged' ? 'সহায়ক খবর নিয়েছেন' : data.alert.status === 'family_escalated' ? 'পরিবারকে জানানো হয়েছে' : 'সহায়কের উত্তর অপেক্ষায়'}</span>{data.alert.status === 'family_escalated' && <p className="mt-2 text-xs font-semibold text-red-700">{familyContact.name} ({familyContact.relationship})-কে সতর্ক করা হয়েছে।</p>}</div></div>}
      {data.emergencyLog.length > 0 && <div className="info-card emergency-history-card"><div className="mini-icon mini-icon-red"><Siren size={22} /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{data.emergencyLog[0].type === 'sos' ? 'SOS alert পাঠানো হয়েছে' : 'অ্যাম্বুলেন্স alert প্রস্তুত'}</p><p className="mt-1 text-sm text-slate-500">{formatDate(data.emergencyLog[0].createdAt)} • {formatTime(data.emergencyLog[0].createdAt)}</p><div className="mt-3 flex flex-wrap gap-2"><span className="emergency-chip"><Check size={13} /> buddy + পরিবার notified</span><span className={`emergency-chip ${data.emergencyLog[0].locationState === 'shared' ? 'location-shared' : ''}`}><LocateFixed size={13} /> {data.emergencyLog[0].locationState === 'shared' ? 'GPS location shared' : data.emergencyLog[0].locationState === 'not_shared' ? 'GPS share হয়নি' : 'GPS unavailable'}</span></div></div></div>}
      <div className="test-card"><div className="flex items-start gap-3"><div className="mini-icon mini-icon-slate"><RefreshCw size={21} /></div><div><p className="font-bold text-slate-900">পরীক্ষার জন্য buddy alert</p><p className="mt-1 text-sm leading-6 text-slate-500">{buddy.name}-এর উত্তর না এলে পরিবারের সদস্যকে সতর্ক করার flow যাচাই করুন।</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button className="secondary-button" onClick={simulateMissedCheckIn}>মিসড check-in দেখুন</button>{data.alert?.status === 'awaiting_buddy' && <><button className="primary-small-button" onClick={acknowledgeBuddy}>সহায়ক উত্তর দিয়েছেন</button><button className="escalate-button" onClick={escalateToFamily}>পরিবারকে জানান</button></>}{data.alert?.status === 'family_escalated' && <button className="secondary-button" onClick={acknowledgeBuddy}>সহায়ক পরে উত্তর দিয়েছেন</button>}</div></div>
    </section>
  );

  const renderProfile = () => (
    <section className="space-y-4">
      <div className="page-title-block"><p className="eyebrow text-teal-700">আপনার পরিচয়</p><h2 className="mt-1 text-3xl font-bold text-slate-900">প্রোফাইল</h2></div>
      <div className="profile-card"><div className="profile-avatar">{elderInitial}</div><div><h3 className="text-xl font-bold text-slate-900">{elderName}</h3><p className="mt-1 text-sm text-slate-500">Elder profile • Gazole, Malda</p></div><button className="icon-button ml-auto" aria-label="প্রোফাইল তথ্য"><Info size={19} /></button></div>
      <div className="info-card buddy-profile-card"><div className="buddy-avatar">{buddy.name.trim().charAt(0) || 'মি'}</div><div className="flex-1"><p className="eyebrow text-slate-400">আমার পাশে আছেন</p><p className="mt-2 font-bold text-slate-900">{buddy.name}</p><p className="mt-1 text-sm text-slate-500">{buddy.type} • {buddy.phone}</p></div><div className="buddy-card-actions"><a href={`tel:${buddy.phone}`} className="call-button" aria-label={`${buddy.name}-কে কল করুন`}><Phone size={19} /></a><button className="edit-buddy-button" onClick={openBuddyEditor}>বদলান</button></div></div>
      <div className="privacy-note"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-700" /><p><strong>আপনার তথ্য ব্যক্তিগত।</strong><br />শুধু আপনার সহায়ক ও নিবন্ধিত পরিবারের সদস্যরা আপনার নিরাপত্তার খবর দেখতে পারবেন।</p></div>
      <div className="info-card flex items-center gap-3"><div className={`mini-icon ${isOnline ? 'mini-icon-teal' : 'mini-icon-amber'}`}>{isOnline ? <Wifi size={21} /> : <WifiOff size={21} />}</div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">সংযোগ ও সিঙ্ক</p><p className="mt-1 text-sm text-slate-500">{isOnline ? (pendingSyncCount ? `${pendingSyncCount}টি তথ্য সিঙ্ক হওয়ার অপেক্ষায়` : data.lastSyncAt ? `শেষ সিঙ্ক: ${formatTime(data.lastSyncAt)}` : 'ইন্টারনেট সংযুক্ত') : `অফলাইন • ${pendingSyncCount}টি তথ্য ফোনে রাখা হচ্ছে`}</p></div>{pendingSyncCount > 0 ? <CloudOff className="text-amber-600" size={20} /> : <CloudUpload className="text-teal-600" size={20} />}</div>
      <div className="notification-settings-card"><div className="notification-settings-copy"><div className="mini-icon mini-icon-amber"><AlarmClock size={21} /></div><div><p className="font-bold text-slate-900">দৈনিক reminder</p><p className="mt-1 text-sm text-slate-500">প্রতিদিন সন্ধ্যা ৬টায় আজকের খোঁজ মনে করিয়ে দিন।</p><small>{notificationSettings.enabled ? (notificationSettings.mode === 'browser' ? 'Browser notification চালু' : 'In-app reminder চালু') : 'এখন বন্ধ'}</small></div></div><div className="notification-actions">{notificationSettings.enabled ? <><button className="secondary-button" onClick={previewLocalReminder}><Bell size={16} /> test</button><button className="remove-contact-button" onClick={disableLocalReminder} aria-label="reminder বন্ধ করুন">বন্ধ</button></> : <button className="primary-small-button" onClick={enableLocalReminder}><Bell size={16} /> চালু করুন</button>}</div></div>
    </section>
  );

  return (
    <div className="app-background">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-lockup"><div className="brand-mark"><HeartPulse size={22} strokeWidth={2.4} /></div><div><p className="brand-name">সংকেত স্নেহ</p><p className="brand-subtitle">Sanket Sneho</p></div></div>
          <div className="topbar-actions"><span className={`connection-pill ${isOnline ? 'online' : 'offline'}`}>{isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}{isOnline ? 'অনলাইন' : 'অফলাইন'}</span>{pendingSyncCount > 0 && <span className="sync-pill"><CloudOff size={13} /> {pendingSyncCount}টি অপেক্ষায়</span>}{pendingSyncCount === 0 && data.lastSyncAt && <span className="sync-pill synced"><CloudUpload size={13} /> সিঙ্ক হয়েছে</span>}<button className="profile-chip" onClick={() => setTab('profile')} aria-label="প্রোফাইল খুলুন"><CircleUserRound size={22} /></button></div>
        </header>

        <main className={`main-content ${!profile ? 'onboarding-content' : ''}`}>
          {!profile && renderOnboarding()}
          {profile && tab === 'home' && renderHome()}
          {profile && tab === 'health' && renderHealth()}
          {profile && tab === 'family' && renderFamily()}
          {profile && tab === 'activity' && renderActivity()}
          {profile && tab === 'profile' && renderProfile()}
        </main>

        {profile && <nav className="bottom-nav" aria-label="প্রধান নেভিগেশন">
          {[['home', Home, 'হোম'], ['health', HeartPulse, 'স্বাস্থ্য'], ['family', UsersRound, 'পরিবার'], ['activity', Activity, 'কার্যকলাপ'], ['profile', CircleUserRound, 'প্রোফাইল']].map(([id, Icon, label]) => <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}><Icon size={22} /><span>{label}</span></button>)}
        </nav>}

        <footer className="app-footer"><span>{APP_VERSION}</span><span className="footer-divider" /><span>গাজোল পাইলট</span></footer>
      </div>

      {reminderNotice && <div className="reminder-banner" role="status"><AlarmClock size={18} /><span>{reminderNotice}</span><button onClick={() => setReminderNotice('')} aria-label="reminder বন্ধ করুন"><X size={16} /></button></div>}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}

      {assignmentOpen && <div className="modal-backdrop" role="presentation" onClick={() => setAssignmentOpen(false)}><form className="modal-card assignment-modal" onSubmit={saveBuddyAssignment} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setAssignmentOpen(false)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol modal-symbol-teal"><UsersRound size={30} /></div><p className="eyebrow mt-5 text-teal-700">সহায়ক assignment</p><h2 className="mt-2 text-2xl font-bold text-slate-900">আপনার সহায়ক বদলান</h2><p className="mt-3 text-sm leading-6 text-slate-600">যিনি নিয়মিত আপনার খবর নিতে পারবেন, তাঁর তথ্য এখানে রাখুন।</p><label className="modal-form-field"><span>সহায়কের নাম</span><input value={buddyValues.name} onChange={(event) => setBuddyValues((previous) => ({ ...previous, name: event.target.value }))} placeholder="যেমন: মিতালি দাস" /></label><label className="modal-form-field"><span>ফোন নম্বর</span><input value={buddyValues.phone} onChange={(event) => setBuddyValues((previous) => ({ ...previous, phone: event.target.value }))} placeholder="১০ অঙ্কের ফোন নম্বর" inputMode="tel" /></label><label className="modal-form-field"><span>সহায়কের ধরন</span><select value={buddyValues.type} onChange={(event) => setBuddyValues((previous) => ({ ...previous, type: event.target.value }))}><option>ASHA সহায়ক</option><option>Anganwadi কর্মী</option><option>স্থানীয় volunteer</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setAssignmentOpen(false)}>এখন নয়</button><button type="submit" className="primary-small-button">তথ্য রাখুন</button></div></form></div>}

      {contactOpen && <div className="modal-backdrop" role="presentation" onClick={() => setContactOpen(false)}><form className="modal-card assignment-modal" onSubmit={saveEmergencyContact} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setContactOpen(false)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol modal-symbol-teal"><UserPlus size={30} /></div><p className="eyebrow mt-5 text-teal-700">নতুন যোগাযোগ</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Emergency contact যোগ করুন</h2><p className="mt-3 text-sm leading-6 text-slate-600">যিনি জরুরি সময়ে elder-এর খবর নিতে পারবেন, তাঁর তথ্য রাখুন।</p><label className="modal-form-field"><span>নাম</span><input value={contactValues.name} onChange={(event) => setContactValues((previous) => ({ ...previous, name: event.target.value }))} placeholder="যেমন: পাপিয়া দেবী" /></label><label className="modal-form-field"><span>সম্পর্ক</span><input value={contactValues.relationship} onChange={(event) => setContactValues((previous) => ({ ...previous, relationship: event.target.value }))} placeholder="যেমন: মেয়ে / প্রতিবেশী" /></label><label className="modal-form-field"><span>ফোন নম্বর</span><input value={contactValues.phone} onChange={(event) => setContactValues((previous) => ({ ...previous, phone: event.target.value }))} placeholder="১০ অঙ্কের ফোন নম্বর" inputMode="tel" /></label><label className="modal-form-field"><span>Priority</span><select value={contactValues.priority} onChange={(event) => setContactValues((previous) => ({ ...previous, priority: event.target.value }))}><option value="secondary">Secondary contact</option><option value="primary">Primary contact</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setContactOpen(false)}>এখন নয়</button><button type="submit" className="primary-small-button">যোগ করুন</button></div></form></div>}

      {reportOpen && <div className="modal-backdrop" role="presentation" onClick={() => setReportOpen(false)}><div className="modal-card report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setReportOpen(false)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol modal-symbol-teal"><FileText size={30} /></div><p className="eyebrow mt-5 text-teal-700">wellness summary</p><h2 id="report-title" className="mt-2 text-2xl font-bold text-slate-900">Health summary report</h2><p className="mt-3 text-sm leading-6 text-slate-600">এটি আপনার entry-র plain-text summary। কোনো diagnosis বা treatment advice এতে নেই।</p><pre className="report-preview">{healthReport}</pre><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setReportOpen(false)}>বন্ধ করুন</button><button type="button" className="primary-small-button" onClick={downloadHealthReport}><FileText size={16} /> .txt download</button></div></div></div>}

      {modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}><div className={`modal-card ${modal === 'ambulance' ? 'modal-amber' : 'modal-red'}`} role="dialog" aria-modal="true" aria-labelledby="emergency-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="বন্ধ করুন"><X size={21} /></button><div className="modal-symbol">{modal === 'ambulance' ? <Ambulance size={32} /> : <LifeBuoy size={32} />}</div><p className="eyebrow mt-5">জরুরি সাহায্য</p><h2 id="emergency-title" className="mt-2 text-2xl font-bold text-slate-900">{modal === 'ambulance' ? 'অ্যাম্বুলেন্স প্রয়োজন?' : 'আপনার কি এখনই সাহায্য দরকার?'}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{modal === 'ambulance' ? 'এই flow-টি আপনার সহায়ক ও পরিবারকে জানাবে। এরপর আপনি ১০৮-এ ফোন করার সুযোগ পাবেন।' : 'একবার confirm করলে আপনার buddy এবং নিবন্ধিত পরিবারের সদস্য—দুজনকেই সঙ্গে সঙ্গে alert পাঠানো হবে।'}</p>{modal === 'sos' && <div className="recipient-preview"><div><UsersRound size={16} /><span>সহায়ক</span><strong>{buddy.name}</strong></div><div><CircleUserRound size={16} /><span>পরিবার</span><strong>{familyContact.name}</strong></div></div>}<div className="location-note"><LocateFixed size={18} /><span>{isOnline ? 'GPS permission দিলে অবস্থান alert-এর সঙ্গে যাবে; না দিলেও alert যাবে' : 'অফলাইন—alert ফোনে রাখা হবে, GPS না গেলে ফোনে সাহায্য নিন'}</span></div><div className="modal-actions"><button className="secondary-button" onClick={() => setModal(null)}>এখন নয়</button><button className="danger-button" onClick={() => sendEmergency(modal)} disabled={emergencySending}>{emergencySending ? 'পাঠানো হচ্ছে…' : modal === 'ambulance' ? 'সতর্ক করে ১০৮ দেখান' : 'দুজনকেই alert করুন'}</button></div>{modal === 'ambulance' && <a className="call-108-link" href="tel:108"><Phone size={17} /> ১০৮-এ ফোন করুন</a>}</div></div>}
    </div>
  );
}

export default App;
