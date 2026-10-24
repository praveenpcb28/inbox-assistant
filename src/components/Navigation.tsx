import React, { useState } from 'react';
import {
  AppScreen,
  ExperienceMode,
  ProviderConnection,
  ThemeMode,
} from '../types/inbox';
import {
  Mail,
  ShieldCheck,
  Sparkles,
  Sliders,
  Clock,
  FileText,
  Lock,
  HelpCircle,
  Sun,
  Moon,
  Layers,
  Inbox,
  UserCheck,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationProps {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  experienceMode: ExperienceMode;
  setExperienceMode: (mode: ExperienceMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  connection: ProviderConnection;
  stagedDraftsCount: number;
  needsReplyCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  setCurrentScreen,
  experienceMode,
  setExperienceMode,
  theme,
  setTheme,
  connection,
  stagedDraftsCount,
  needsReplyCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const screens: { id: AppScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'inbox', label: 'Inbox Overview', icon: Inbox },
    { id: 'workbench', label: 'Review Workbench', icon: Sparkles },
    { id: 'onboarding', label: 'Setup Guide', icon: UserCheck },
    { id: 'connect', label: 'Mailbox', icon: Mail },
    { id: 'preferences', label: 'Writing Voice', icon: Sliders },
    { id: 'rules', label: 'Smart Rules', icon: Layers },
    { id: 'schedule', label: 'Scheduled Checks', icon: Clock },
    { id: 'activity', label: 'Audit Log', icon: FileText },
    { id: 'security', label: 'Privacy & Safety', icon: Lock },
    { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
  ];

  const handleSelectScreen = (screenId: AppScreen) => {
    setCurrentScreen(screenId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        {/* Top Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Lockup */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => handleSelectScreen('inbox')}
              aria-label="Inbox Assistant Studio - Home"
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
                  Inbox Assistant
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Your inbox, understood. Your decision.
              </p>
            </button>
          </div>

          {/* Desktop Right Controls (≥ 1024px) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Experience Mode Switcher */}
            <div
              role="radiogroup"
              aria-label="Experience Mode"
              className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              {(['simple', 'balanced', 'advanced'] as ExperienceMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={experienceMode === mode}
                  onClick={() => setExperienceMode(mode)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer capitalize ${
                    experienceMode === mode
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Connection Status Badge */}
            <button
              type="button"
              onClick={() => handleSelectScreen('connect')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
            >
              {connection.mode === 'demo' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span className="font-medium">Demo Mode</span>
                </>
              ) : connection.status === 'connected' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {connection.provider === 'outlook' ? 'Outlook' : 'Gmail'}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span className="text-amber-700 dark:text-amber-300 font-medium">Connect</span>
                </>
              )}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Quick Action Buttons (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            {/* Mobile Connection Badge */}
            <button
              type="button"
              onClick={() => handleSelectScreen('connect')}
              aria-label="Mailbox Connection Status"
              className="min-h-[44px] px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300"
            >
              <span className={`w-2 h-2 rounded-full ${connection.mode === 'real' ? 'bg-emerald-500' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="font-semibold text-[11px]">
                {connection.mode === 'real' ? connection.provider.toUpperCase() : 'DEMO'}
              </span>
            </button>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Hamburger / Close Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Tablist Bar (≥ 1024px) */}
        <nav
          aria-label="Desktop Screen Navigation"
          role="tablist"
          className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-1.5 overflow-x-auto py-1 border-t border-slate-200 dark:border-slate-800/80 no-scrollbar"
        >
          {screens.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => handleSelectScreen(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isActive
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'workbench' && needsReplyCount > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold">
                    {needsReplyCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Mobile Collapsible Navigation Menu Drawer (< 1024px) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 z-40 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 flex flex-col justify-between"
        >
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Experience Mode Picker on Mobile */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Experience Density Mode:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['simple', 'balanced', 'advanced'] as ExperienceMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setExperienceMode(mode)}
                    className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer border ${
                      experienceMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* PWA Install Button on Mobile */}
            <div className="pt-1 pb-1">
              <PWAInstallButton className="w-full justify-center" />
            </div>

            {/* Screen Navigation Links */}
            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                All Application Screens:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {screens.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectScreen(item.id)}
                      className={`min-h-[44px] w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'workbench' && needsReplyCount > 0 && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {needsReplyCount} urgent
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Button at Drawer Bottom */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full min-h-[44px] py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Close Menu
              </button>
            </div>
          </div>

          {/* Backdrop Click Dismiss */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Sticky Bottom Tab Bar (Quick Access on phones < 768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-1.5 px-2">
        <button
          type="button"
          onClick={() => handleSelectScreen('inbox')}
          aria-label="Inbox Overview"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-1 text-[10px] font-medium transition cursor-pointer ${
            currentScreen === 'inbox' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Inbox className="w-5 h-5 mb-0.5" />
          <span>Inbox</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScreen('workbench')}
          aria-label="Review Workbench"
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-1 text-[10px] font-medium transition cursor-pointer ${
            currentScreen === 'workbench' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Review</span>
          {needsReplyCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-white font-mono text-[9px] flex items-center justify-center font-bold">
              {needsReplyCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelectScreen('connect')}
          aria-label="Mailbox Connection"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-1 text-[10px] font-medium transition cursor-pointer ${
            currentScreen === 'connect' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Mail className="w-5 h-5 mb-0.5" />
          <span>Mailbox</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="More Features Menu"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-1 text-[10px] font-medium transition cursor-pointer ${
            isMobileMenuOpen ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>
    </>
  );
};
