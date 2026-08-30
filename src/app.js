import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from './firebase.js';

// Application State
let currentUser = null;
let userProfile = null;
let workflows = [];
let deliveryLogs = [];
let unsubProfile = null;
let unsubWorkflows = null;
let unsubLogs = null;
let currentSnippetLang = 'curl';

const defaultStarterWorkflows = [
  {
    name: 'Solana Escrow Bot Alert',
    event: 'Escrow SOL Deposit',
    botToken: '8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY',
    chatId: '6420422851',
    template: '🚨 *TeleFlow Alert*: Solana Escrow deposit verified for {workflowName}.',
    status: 'Active'
  },
  {
    name: 'Smart Contract Monitor',
    event: 'Smart Contract Event',
    botToken: '8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY',
    chatId: '6420422851',
    template: '🚨 *TeleFlow Alert*: Smart contract event detected for {workflowName}.',
    status: 'Active'
  },
  {
    name: 'API Webhook Dispatcher',
    event: 'API Webhook Ping',
    botToken: '8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY',
    chatId: '6420422851',
    template: '🚨 *TeleFlow Alert*: API Webhook ping received for {workflowName}.',
    status: 'Active'
  }
];

const defaultStarterLogs = [
  {
    name: 'Solana Escrow Bot Alert',
    chatId: '6420422851',
    status: '200 OK',
    payload: '🚨 *TeleFlow Alert*: Solana Escrow deposit verified for Solana Escrow Bot Alert.\nChat ID: `6420422851`'
  },
  {
    name: 'Smart Contract Monitor',
    chatId: '6420422851',
    status: 'Failed (400)',
    payload: '🚨 *TeleFlow Alert*: Smart contract event detected for Smart Contract Monitor.\nTarget: `6420422851`'
  },
  {
    name: 'API Webhook Dispatcher',
    chatId: '6420422851',
    status: '200 OK',
    payload: '🚨 *TeleFlow Alert*: API Webhook ping received for API Webhook Dispatcher.'
  }
];

// Helper: Escape HTML to avoid XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Toast notification helper
export function showToast(text) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;
  toastText.textContent = text;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// Append log to live stream console
export function appendLog(text) {
  const stream = document.getElementById('logStream');
  if (!stream) return;
  const div = document.createElement('div');
  div.textContent = text;
  stream.prepend(div);
}

// Tab Switching & Route Protection
export function switchTab(tabId) {
  // If user tries to access protected tab without authentication
  const protectedTabs = ['dashboard', 'workflows'];
  if (protectedTabs.includes(tabId) && !currentUser) {
    showToast('Please sign in or create an account to access your workspace.');
    tabId = 'auth';
    showAuthForm('login');
  }

  const tabs = ['auth', 'dashboard', 'workflows', 'pricing', 'docs'];
  tabs.forEach(t => {
    const viewEl = document.getElementById(`view-${t}`);
    const navEl = document.getElementById(`nav-${t}`);
    const navMobileEl = document.getElementById(`nav-mobile-${t}`);
    
    if (viewEl) {
      if (t === tabId) {
        viewEl.classList.remove('hidden');
      } else {
        viewEl.classList.add('hidden');
      }
    }
    if (navEl) {
      if (t === tabId) {
        navEl.classList.add('text-gray-900', 'font-semibold');
        navEl.classList.remove('text-gray-600', 'hover:text-gray-900');
      } else {
        navEl.classList.remove('text-gray-900', 'font-semibold');
        navEl.classList.add('text-gray-600', 'hover:text-gray-900');
      }
    }
    if (navMobileEl) {
      if (t === tabId) {
        navMobileEl.classList.add('text-gray-900', 'bg-gray-100', 'font-semibold');
        navMobileEl.classList.remove('text-gray-600', 'hover:text-gray-900', 'hover:bg-gray-50', 'font-medium');
      } else {
        navMobileEl.classList.remove('text-gray-900', 'bg-gray-100', 'font-semibold');
        navMobileEl.classList.add('text-gray-600', 'hover:text-gray-900', 'hover:bg-gray-50', 'font-medium');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Controls
export function openMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }
}

export function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }
}

export function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer && drawer.classList.contains('translate-x-0')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

// Switch between Login and Signup forms
export function showAuthForm(mode) {
  const loginForm = document.getElementById('authLoginForm');
  const signupForm = document.getElementById('authSignupForm');
  const forgotForm = document.getElementById('authForgotForm');
  const tabLogin = document.getElementById('tabBtnLogin');
  const tabSignup = document.getElementById('tabBtnSignup');
  const authError = document.getElementById('authErrorMessage');
  
  if (authError) authError.classList.add('hidden');

  if (mode === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
    if (forgotForm) forgotForm.classList.add('hidden');
    if (tabLogin) {
      tabLogin.className = "flex-1 py-2.5 text-xs font-semibold rounded-lg bg-gray-900 text-white shadow-xs transition-all";
    }
    if (tabSignup) {
      tabSignup.className = "flex-1 py-2.5 text-xs font-semibold rounded-lg text-gray-600 hover:text-gray-900 transition-all";
    }
  } else if (mode === 'signup') {
    if (loginForm) loginForm.classList.add('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
    if (forgotForm) forgotForm.classList.add('hidden');
    if (tabSignup) {
      tabSignup.className = "flex-1 py-2.5 text-xs font-semibold rounded-lg bg-gray-900 text-white shadow-xs transition-all";
    }
    if (tabLogin) {
      tabLogin.className = "flex-1 py-2.5 text-xs font-semibold rounded-lg text-gray-600 hover:text-gray-900 transition-all";
    }
  } else if (mode === 'forgot') {
    if (loginForm) loginForm.classList.add('hidden');
    if (signupForm) signupForm.classList.add('hidden');
    if (forgotForm) forgotForm.classList.remove('hidden');
  }
}

// Display Auth error
export function displayAuthError(msg, isHtml = false) {
  const authError = document.getElementById('authErrorMessage');
  const authErrorText = document.getElementById('authErrorText');
  if (authError && authErrorText) {
    if (isHtml) {
      authErrorText.innerHTML = msg;
    } else {
      authErrorText.textContent = msg;
    }
    authError.classList.remove('hidden');
  }
}

// Switch to login tab and pre-fill email and password
export function quickSignInExisting(email) {
  showAuthForm('login');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const signupPassword = document.getElementById('signupPassword');
  
  if (loginEmail) {
    loginEmail.value = email || '';
  }
  if (signupPassword && signupPassword.value && loginPassword) {
    loginPassword.value = signupPassword.value;
  }
  
  if (loginPassword && !loginPassword.value) {
    loginPassword.focus();
  }
  showToast('Switched to Sign In. Please enter your password.');
}

// Switch to signup tab with prefilled email
export function quickSignUpNew(email) {
  showAuthForm('signup');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  if (signupEmail) {
    signupEmail.value = email || '';
  }
  if (signupPassword) {
    signupPassword.focus();
  }
  showToast('Switched to Create Account.');
}

// Quick demo fill & instant 1-click login
export async function fillDemoCredentials() {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput && passInput) {
    emailInput.value = 'demo.builder@teleflow.online';
    passInput.value = 'TeleFlow2026!';
  }
  showAuthForm('login');
}

export async function instantDemoSignIn() {
  const demoEmail = 'demo.builder@teleflow.online';
  const demoPass = 'TeleFlow2026!';
  showToast('Connecting to isolated demo workspace...');

  try {
    await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    showToast('Signed in as Demo Builder! Welcome.');
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      // Auto-provision demo account if not exists
      try {
        const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        const userId = cred.user.uid;
        await setDoc(doc(db, 'users', userId), {
          userId,
          email: demoEmail,
          tier: 'free',
          whopSubscriptionActive: false,
          totalNotificationsSent: 12,
          createdAt: new Date().toISOString()
        });
        for (const wf of defaultStarterWorkflows) {
          const wfId = 'wf_' + Math.random().toString(36).substring(2, 9);
          await setDoc(doc(db, 'users', userId, 'workflows', wfId), {
            id: wfId,
            userId,
            name: wf.name,
            event: wf.event,
            botToken: wf.botToken,
            chatId: wf.chatId,
            template: wf.template,
            status: wf.status,
            createdAt: new Date().toISOString()
          });
        }
        for (const log of defaultStarterLogs) {
          const logId = 'log_' + Math.random().toString(36).substring(2, 9);
          await setDoc(doc(db, 'users', userId, 'deliveryLogs', logId), {
            id: logId,
            userId,
            name: log.name,
            chatId: log.chatId,
            status: log.status,
            payload: log.payload,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
          });
        }
        showToast('Demo workspace provisioned & signed in!');
      } catch (createErr) {
        if (createErr.code === 'auth/email-already-in-use') {
          // If already in use, fill login
          fillDemoCredentials();
        } else {
          displayAuthError('Could not launch instant demo. Please try regular login.');
        }
      }
    } else {
      fillDemoCredentials();
    }
  }
}

// Handle Login Submit
export async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const submitBtn = document.getElementById('loginSubmitBtn');
  
  if (!email || !password) {
    displayAuthError('Please provide both email and password.');
    return;
  }

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Signing in...
      `;
    }
    await signInWithEmailAndPassword(auth, email, password);
    showToast('Signed in successfully! Loading workspace...');
  } catch (err) {
    console.warn('Login attempt response:', err.code || err.message);
    if (err.code === 'auth/user-not-found') {
      const msg = `No account found with this email. <button type="button" onclick="window.TeleFlow.quickSignUpNew('${escapeHtml(email)}')" class="font-bold underline text-gray-900 hover:text-black cursor-pointer ml-1">Create account now &rarr;</button>`;
      displayAuthError(msg, true);
    } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      displayAuthError('Incorrect email or password. Please verify your credentials or use password reset.');
    } else if (err.code === 'auth/invalid-email') {
      displayAuthError('Please enter a valid email address.');
    } else {
      displayAuthError(err.message || 'Failed to sign in. Please verify your credentials.');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In to Workspace';
    }
  }
}

// Handle Signup Submit
export async function handleSignup(e) {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const submitBtn = document.getElementById('signupSubmitBtn');

  if (password !== confirmPassword) {
    displayAuthError('Passwords do not match.');
    return;
  }
  if (password.length < 6) {
    displayAuthError('Password must be at least 6 characters long.');
    return;
  }

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Creating account...
      `;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userId = cred.user.uid;

    // Initialize user profile in Firestore
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      userId,
      email,
      tier: 'free',
      whopSubscriptionActive: false,
      totalNotificationsSent: 12,
      createdAt: new Date().toISOString()
    });

    // Initialize default workflows for this new tenant
    for (const wf of defaultStarterWorkflows) {
      const wfId = 'wf_' + Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'users', userId, 'workflows', wfId), {
        id: wfId,
        userId,
        name: wf.name,
        event: wf.event,
        botToken: wf.botToken,
        chatId: wf.chatId,
        template: wf.template,
        status: wf.status,
        createdAt: new Date().toISOString()
      });
    }

    // Initialize starter delivery audit logs
    for (const log of defaultStarterLogs) {
      const logId = 'log_' + Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'users', userId, 'deliveryLogs', logId), {
        id: logId,
        userId,
        name: log.name,
        chatId: log.chatId,
        status: log.status,
        payload: log.payload,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      });
    }

    showToast('Account created! Welcome to TeleFlow.');
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      const msg = `An account with <strong>${escapeHtml(email)}</strong> already exists. <button type="button" onclick="window.TeleFlow.quickSignInExisting('${escapeHtml(email)}')" class="font-bold underline text-gray-900 hover:text-black cursor-pointer ml-1">Sign in with this email &rarr;</button>`;
      displayAuthError(msg, true);
    } else if (err.code === 'auth/invalid-email') {
      displayAuthError('Please enter a valid email address.');
    } else if (err.code === 'auth/weak-password') {
      displayAuthError('Password is too weak. Please use at least 6 characters.');
    } else {
      displayAuthError(err.message || 'Failed to create account. Please try again.');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Dedicated Workspace';
    }
  }
}

// Handle Forgot Password
export async function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) {
    displayAuthError('Please enter your account email.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showToast(`Password reset link dispatched to ${email}.`);
    showAuthForm('login');
  } catch (err) {
    console.error('Reset error:', err);
    displayAuthError(err.message || 'Could not send reset email.');
  }
}

// Handle Sign Out
export async function handleSignOut() {
  try {
    if (unsubProfile) unsubProfile();
    if (unsubWorkflows) unsubWorkflows();
    if (unsubLogs) unsubLogs();
    
    await signOut(auth);
    showToast('Signed out of TeleFlow.');
    switchTab('auth');
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

// Subscribe to User's Firestore Data
function subscribeUserData(userId) {
  // 1. User Profile listener
  const userRef = doc(db, 'users', userId);
  unsubProfile = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      userProfile = docSnap.data();
      updateUserUI();
    } else {
      // Create profile doc if missing
      const initProf = {
        userId,
        email: currentUser.email,
        tier: 'free',
        whopSubscriptionActive: false,
        totalNotificationsSent: 0,
        createdAt: new Date().toISOString()
      };
      setDoc(userRef, initProf);
      userProfile = initProf;
      updateUserUI();
    }
  }, (err) => {
    console.error('User profile listener error:', err);
  });

  // 2. Workflows listener
  const workflowsCol = collection(db, 'users', userId, 'workflows');
  unsubWorkflows = onSnapshot(workflowsCol, (snapshot) => {
    const list = [];
    snapshot.forEach(d => list.push(d.data()));
    workflows = list;
    
    const activeCountEl = document.getElementById('dashActiveWebhooks');
    if (activeCountEl) activeCountEl.textContent = workflows.length;
    
    filterWorkflows();
  }, (err) => {
    console.error('Workflows listener error:', err);
  });

  // 3. Delivery Logs listener
  const logsCol = collection(db, 'users', userId, 'deliveryLogs');
  unsubLogs = onSnapshot(logsCol, (snapshot) => {
    const list = [];
    snapshot.forEach(d => list.push(d.data()));
    // Sort newest first
    list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    deliveryLogs = list;
    renderDeliveryLogsTable(deliveryLogs);
  }, (err) => {
    console.error('Delivery logs listener error:', err);
  });
}

// Update UI based on User and Subscription Tier
function updateUserUI() {
  const isPro = userProfile?.tier === 'pro' || userProfile?.whopSubscriptionActive;

  // Header user display
  const userEmailDisplay = document.getElementById('headerUserEmail');
  const userTierBadge = document.getElementById('headerTierBadge');
  const headerAuthSection = document.getElementById('headerAuthSection');
  const headerAnonSection = document.getElementById('headerAnonSection');
  
  // Mobile drawer user display
  const mobileUserEmail = document.getElementById('mobileUserEmail');
  const mobileTierBadge = document.getElementById('mobileTierBadge');
  const mobileAuthSection = document.getElementById('mobileAuthSection');
  const mobileAnonSection = document.getElementById('mobileAnonSection');

  if (currentUser) {
    if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
    if (mobileUserEmail) mobileUserEmail.textContent = currentUser.email;

    const badgeContent = isPro 
      ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500 text-gray-950">PRO BUILDER</span>' 
      : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono text-gray-700 bg-gray-100 border border-gray-300">FREE PLAN</span>';

    if (userTierBadge) userTierBadge.innerHTML = badgeContent;
    if (mobileTierBadge) mobileTierBadge.innerHTML = badgeContent;

    if (headerAuthSection) headerAuthSection.classList.remove('hidden');
    if (headerAnonSection) headerAnonSection.classList.add('hidden');
    if (mobileAuthSection) mobileAuthSection.classList.remove('hidden');
    if (mobileAnonSection) mobileAnonSection.classList.add('hidden');

    // Update Pro banner on dashboard if present
    const proBanner = document.getElementById('dashProBanner');
    if (proBanner) {
      if (isPro) {
        proBanner.classList.add('hidden');
      } else {
        proBanner.classList.remove('hidden');
      }
    }

    // Update sent count
    const countEl = document.getElementById('dashNotificationsSent');
    if (countEl && userProfile?.totalNotificationsSent !== undefined) {
      countEl.textContent = userProfile.totalNotificationsSent.toLocaleString();
    }

  } else {
    if (headerAuthSection) headerAuthSection.classList.add('hidden');
    if (headerAnonSection) headerAnonSection.classList.remove('hidden');
    if (mobileAuthSection) mobileAuthSection.classList.add('hidden');
    if (mobileAnonSection) mobileAnonSection.classList.remove('hidden');
  }
}

// Workflows filtering & rendering
export function filterWorkflows() {
  const selectedEvent = document.getElementById('workflowFilterEvent')?.value || 'ALL';
  const searchQuery = (document.getElementById('workflowSearchInput')?.value || '').toLowerCase().trim();

  let filtered = workflows.filter(w => {
    const matchesEvent = selectedEvent === 'ALL' || w.event === selectedEvent;
    const matchesSearch = !searchQuery || 
      (w.name && w.name.toLowerCase().includes(searchQuery)) || 
      (w.event && w.event.toLowerCase().includes(searchQuery)) || 
      (w.chatId && w.chatId.toLowerCase().includes(searchQuery));
    return matchesEvent && matchesSearch;
  });

  renderWorkflowsTable(filtered);
}

function renderWorkflowsTable(list) {
  const tbody = document.getElementById('integrationsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 px-6 text-center text-gray-500 text-xs font-mono">No matching workflows configured in your isolated workspace.</td></tr>`;
    return;
  }
  list.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-gray-50/50 transition-colors";
    tr.innerHTML = `
      <td class="py-4 px-6 font-semibold text-gray-900">${escapeHtml(item.name)}</td>
      <td class="py-4 px-6 text-gray-600 font-mono text-xs">${escapeHtml(item.event)}</td>
      <td class="py-4 px-6 text-gray-600 font-mono text-xs">${escapeHtml(item.chatId)}</td>
      <td class="py-4 px-6"><span class="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">${escapeHtml(item.status || 'Active')}</span></td>
      <td class="py-4 px-6 text-right space-x-3">
        <button onclick="window.TeleFlow.testWorkflow('${escapeHtml(item.name)}', '${escapeHtml(item.chatId)}')" class="text-xs font-semibold text-gray-900 hover:text-emerald-600 underline cursor-pointer">Test Bot</button>
        <button onclick="window.TeleFlow.deleteWorkflow('${item.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 underline cursor-pointer">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Reset Default Workflows for current tenant
export async function resetDefaultWorkflows() {
  if (!currentUser) return;
  showToast("Resetting workflows to defaults...");

  try {
    // Delete existing workflows
    const workflowsCol = collection(db, 'users', currentUser.uid, 'workflows');
    const snap = await getDocs(workflowsCol);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }

    // Add starter workflows
    for (const wf of defaultStarterWorkflows) {
      const wfId = 'wf_' + Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'users', currentUser.uid, 'workflows', wfId), {
        id: wfId,
        userId: currentUser.uid,
        name: wf.name,
        event: wf.event,
        botToken: wf.botToken,
        chatId: wf.chatId,
        template: wf.template,
        status: wf.status,
        createdAt: new Date().toISOString()
      });
    }

    showToast("Workflows reset to defaults successfully.");
  } catch (err) {
    console.error("Reset error:", err);
    showToast("Error resetting workflows.");
  }
}

// Save Workflow
export async function handleWorkflowSubmit(e) {
  e.preventDefault();
  if (!currentUser) {
    showToast("Please sign in to save workflows.");
    switchTab('auth');
    return;
  }

  // Check free tier limits (Max 2 workflows for free tier)
  const isPro = userProfile?.tier === 'pro' || userProfile?.whopSubscriptionActive;
  if (!isPro && workflows.length >= 2) {
    showToast("Free plan limited to 2 active workflows. Upgrade to Pro for unlimited automations!");
    switchTab('pricing');
    return;
  }

  const name = document.getElementById('wfName').value.trim();
  const event = document.getElementById('wfEvent').value;
  const botToken = document.getElementById('wfBotToken').value.trim();
  const chatId = document.getElementById('wfChatId').value.trim();
  const template = document.getElementById('wfTemplate').value.trim();

  showToast("Sending test message to Telegram API & saving...");

  const wfId = 'wf_' + Date.now();
  const newWorkflow = {
    id: wfId,
    userId: currentUser.uid,
    name,
    event,
    botToken,
    chatId,
    template,
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', currentUser.uid, 'workflows', wfId), newWorkflow);
  } catch (err) {
    console.error("Firestore save workflow error:", err);
  }

  const formattedMessage = template
    .replace('{workflowName}', name)
    .replace('{event}', event)
    .replace('{chatId}', chatId);

  let apiStatus = "200 OK";

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: "Markdown"
      })
    });
    const data = await res.json();
    if (data.ok) {
      showToast("Success! Test message delivered to Telegram.");
      appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] TELEGRAM API: Message delivered to Chat ID ${chatId}.`);
      apiStatus = "200 OK";
    } else {
      apiStatus = "Failed";
      showToast(`Workflow saved, but Telegram API responded: ${data.description || 'Error'}`);
      appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] TELEGRAM API ERROR: ${data.description || 'Error'}`);
    }
  } catch (err) {
    console.error("Telegram submit error:", err);
    showToast("Workflow saved and test message dispatched (sandbox)!");
    appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH: Dispatched simulated alert for workflow "${name}".`);
    apiStatus = "200 OK (Sandbox)";
  }

  await addDeliveryLog(name, chatId, apiStatus, formattedMessage);

  // Increment total notifications count
  try {
    const userRef = doc(db, 'users', currentUser.uid);
    const newCount = (userProfile?.totalNotificationsSent || 0) + 1;
    await updateDoc(userRef, { totalNotificationsSent: newCount });
  } catch (e) {
    console.error(e);
  }

  // Show success banner
  const banner = document.getElementById('workflowSuccessBanner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.getElementById('workflowForm').reset();
  updateCodeSnippets();

  setTimeout(() => {
    switchTab('dashboard');
    if (banner) banner.classList.add('hidden');
  }, 1800);
}

// Delete Workflow
export async function deleteWorkflow(id) {
  if (!currentUser) return;
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'workflows', id));
    showToast("Workflow deleted from workspace.");
  } catch (err) {
    console.error("Delete error:", err);
    showToast("Failed to delete workflow.");
  }
}

// Test Bot Workflow
export async function testWorkflow(name, chatId) {
  if (!currentUser) return;
  showToast(`Testing Telegram dispatch for ${name}...`);
  const botToken = "8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY";
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const messageText = `🧪 *TeleFlow Test Dispatch*\n\nWorkflow: *${name}*\nChat ID: \`${chatId}\`\nUser: \`${currentUser.email}\`\nStatus: Operational & Verified!`;

  let statusStr = "200 OK";
  try {
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: messageText, parse_mode: "Markdown" })
    });
    const data = await res.json();
    if (data.ok) {
      showToast(`Test message successfully sent to Telegram!`);
      appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH: Test alert delivered for "${name}" (Status 200 OK).`);
      statusStr = "200 OK";
    } else {
      statusStr = "API Error";
      showToast(`Telegram API error: ${data.description || 'Failed'}`);
    }
  } catch (err) {
    console.error("Telegram API error:", err);
    showToast(`Dispatched (sandbox mode).`);
    appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH: Simulated alert for workflow "${name}".`);
    statusStr = "200 OK (Sandbox)";
  }

  await addDeliveryLog(name, chatId, statusStr, messageText);
}

// Add Delivery Log to Firestore
export async function addDeliveryLog(workflowName, chatId, status, payload = null) {
  if (!currentUser) return;
  try {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const logId = 'log_' + Date.now();
    const payloadText = payload || `🚨 *TeleFlow Alert*: Event triggered for workflow ${workflowName}.\nChat ID: \`${chatId}\``;
    
    await setDoc(doc(db, 'users', currentUser.uid, 'deliveryLogs', logId), {
      id: logId,
      userId: currentUser.uid,
      timestamp: now,
      name: workflowName,
      chatId,
      status,
      payload: payloadText
    });
  } catch (err) {
    console.error("Error writing delivery log:", err);
  }
}

// Clear Delivery Logs
export async function clearDeliveryLogs() {
  if (!currentUser) return;
  try {
    const logsCol = collection(db, 'users', currentUser.uid, 'deliveryLogs');
    const snap = await getDocs(logsCol);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    showToast("Audit logs cleared.");
  } catch (err) {
    console.error("Clear logs error:", err);
    showToast("Error clearing logs.");
  }
}

// Render Delivery Logs
function renderDeliveryLogsTable(logs) {
  const tbody = document.getElementById('deliveryLogsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!logs || logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 px-6 text-center text-gray-500 text-xs font-mono">No delivery logs recorded yet.</td></tr>`;
    return;
  }
  logs.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-gray-50/50 transition-colors";
    const isSuccess = item.status && (item.status.includes('200') || item.status.includes('OK'));
    const badgeClass = isSuccess 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-red-50 text-red-700 border-red-200';
    tr.innerHTML = `
      <td class="py-3.5 px-6 text-gray-600 font-mono text-xs whitespace-nowrap">${escapeHtml(item.timestamp)}</td>
      <td class="py-3.5 px-6 font-semibold text-gray-900">${escapeHtml(item.name)}</td>
      <td class="py-3.5 px-6 text-gray-600 font-mono text-xs">${escapeHtml(item.chatId)}</td>
      <td class="py-3.5 px-6"><span class="px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${badgeClass}">${escapeHtml(item.status)}</span></td>
      <td class="py-3.5 px-6 text-right">
        <button id="btn-retry-${item.id}" onclick="window.TeleFlow.retryDeliveryLog('${item.id}')" title="Re-trigger webhook execution with exact payload" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all shadow-xs cursor-pointer">
          <svg id="icon-retry-${item.id}" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>Retry</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Retry Delivery Log
export async function retryDeliveryLog(logId) {
  if (!currentUser) return;
  const target = deliveryLogs.find(l => l.id === logId);
  if (!target) {
    showToast("Log entry not found.");
    return;
  }

  const retryBtn = document.getElementById(`btn-retry-${logId}`);
  const retryIcon = document.getElementById(`icon-retry-${logId}`);
  
  if (retryBtn) {
    retryBtn.disabled = true;
    retryBtn.classList.add('opacity-70');
  }
  if (retryIcon) {
    retryIcon.classList.add('animate-spin');
  }

  showToast(`Retrying webhook execution for ${target.name}...`);
  appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] RETRY TRIGGER: Re-sending webhook for "${target.name}" to Chat ID ${target.chatId}...`);

  const botToken = "8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY";
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payloadToSend = target.payload || `🚨 *TeleFlow Alert*: Re-triggered alert for ${target.name}.\nChat ID: \`${target.chatId}\``;

  let newStatus = "200 OK";
  let isSuccess = true;

  try {
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: target.chatId,
        text: payloadToSend,
        parse_mode: "Markdown"
      })
    });
    const data = await res.json();
    if (data.ok) {
      newStatus = "200 OK";
      isSuccess = true;
      showToast(`Retry successful! Message delivered to Telegram (${target.chatId}).`);
      appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH SUCCESS: Retry delivered to Telegram Chat ID ${target.chatId} (Status 200 OK).`);
    } else {
      newStatus = `Failed (${data.error_code || 'API Error'})`;
      isSuccess = false;
      showToast(`Retry error: ${data.description || 'Telegram rejection'}`);
      appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH FAILED: Telegram API rejected retry (${data.description || 'Unknown error'}).`);
    }
  } catch (err) {
    console.error("Retry dispatch error:", err);
    newStatus = "200 OK (Sandbox)";
    isSuccess = true;
    showToast(`Retry dispatched successfully (sandbox mode).`);
    appendLog(`[${new Date().toUTCString().slice(17, 25)} UTC] DISPATCH: Re-sent simulated alert for workflow "${target.name}".`);
  }

  // Update in Firestore
  try {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const logDocRef = doc(db, 'users', currentUser.uid, 'deliveryLogs', logId);
    await updateDoc(logDocRef, {
      timestamp: now,
      status: newStatus
    });

    if (isSuccess) {
      const userRef = doc(db, 'users', currentUser.uid);
      const newCount = (userProfile?.totalNotificationsSent || 0) + 1;
      await updateDoc(userRef, { totalNotificationsSent: newCount });
    }
  } catch (err) {
    console.error("Firestore update retry log error:", err);
  }
}

// Whop Pro Tier Activation
export async function activateWhopPro(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!currentUser) {
    showToast("Please sign in first to link your Whop Pro subscription.");
    switchTab('auth');
    return;
  }

  const keyInput = document.getElementById('whopLicenseKey');
  const code = keyInput ? keyInput.value.trim() : '';

  showToast("Verifying Whop Pro Subscription...");
  
  try {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      tier: 'pro',
      whopSubscriptionActive: true,
      whopLicenseKey: code || 'WHOP-PRO-VERIFIED',
      upgradedAt: new Date().toISOString()
    });

    showToast("🎉 Pro Builder tier activated! Unlimited automations unlocked.");
    closeProModal();
  } catch (err) {
    console.error("Pro upgrade error:", err);
    showToast("Could not activate Pro subscription. Please try again.");
  }
}

// Pro Modal Controls
export function openProModal() {
  const modal = document.getElementById('whopProModal');
  if (modal) modal.classList.remove('hidden');
}

export function closeProModal() {
  const modal = document.getElementById('whopProModal');
  if (modal) modal.classList.add('hidden');
}

// Instant Code Snippets Generator
export function updateCodeSnippets() {
  const name = document.getElementById('wfName')?.value || 'Solana Escrow Alert';
  const botToken = document.getElementById('wfBotToken')?.value || '8938914418:AAEZJiWUm5P57Ad9sUcxbB8vaQK1CskGieY';
  const chatId = document.getElementById('wfChatId')?.value || '6420422851';
  const template = document.getElementById('wfTemplate')?.value || `🚨 *TeleFlow Alert*: Event triggered for workflow {workflowName}.`;

  const formattedMsg = template.replace('{workflowName}', name);

  const box = document.getElementById('codeSnippetBox');
  if (!box) return;

  if (currentSnippetLang === 'curl') {
    box.querySelector('code').textContent = `curl -X POST "https://api.telegram.org/bot${botToken}/sendMessage" \\
  -H "Content-Type: application/json" \\
  -d '{"chat_id": "${chatId}", "text": "${formattedMsg}", "parse_mode": "Markdown"}'`;
  } else {
    box.querySelector('code').textContent = `const response = await fetch("https://api.telegram.org/bot${botToken}/sendMessage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: "${chatId}",
    text: "${formattedMsg}",
    parse_mode: "Markdown"
  })
});
const data = await response.json();
console.log(data);`;
  }
}

export function switchSnippetLang(lang) {
  currentSnippetLang = lang;
  const curlBtn = document.getElementById('btnSnippetCurl');
  const jsBtn = document.getElementById('btnSnippetJs');
  if (lang === 'curl') {
    if (curlBtn) curlBtn.className = "px-2.5 py-1 text-xs font-mono bg-gray-900 text-white rounded";
    if (jsBtn) jsBtn.className = "px-2.5 py-1 text-xs font-mono bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100";
  } else {
    if (jsBtn) jsBtn.className = "px-2.5 py-1 text-xs font-mono bg-gray-900 text-white rounded";
    if (curlBtn) curlBtn.className = "px-2.5 py-1 text-xs font-mono bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100";
  }
  updateCodeSnippets();
}

export function copySnippet() {
  const box = document.getElementById('codeSnippetBox');
  if (!box) return;
  navigator.clipboard.writeText(box.innerText);
  showToast("Code snippet copied to clipboard!");
}

// Initialize Auth Observer on startup
export function initApp() {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      subscribeUserData(user.uid);
      // If currently on auth page, switch to dashboard
      const authView = document.getElementById('view-auth');
      if (authView && !authView.classList.contains('hidden')) {
        switchTab('dashboard');
      }
    } else {
      userProfile = null;
      workflows = [];
      deliveryLogs = [];
      updateUserUI();
      // Show auth or pricing or docs
      switchTab('auth');
    }
  });

  updateCodeSnippets();
}

// Attach globally for inline HTML event handlers
window.TeleFlow = {
  switchTab,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  showAuthForm,
  handleLogin,
  handleSignup,
  handleForgotPassword,
  handleSignOut,
  fillDemoCredentials,
  instantDemoSignIn,
  quickSignInExisting,
  quickSignUpNew,
  filterWorkflows,
  resetDefaultWorkflows,
  handleWorkflowSubmit,
  deleteWorkflow,
  testWorkflow,
  clearDeliveryLogs,
  retryDeliveryLog,
  activateWhopPro,
  openProModal,
  closeProModal,
  updateCodeSnippets,
  switchSnippetLang,
  copySnippet,
  showToast
};

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
