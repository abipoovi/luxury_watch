import { useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';

interface PrivateSalonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDIAN_SALONS = [
  'Mumbai · The Taj Mahal Palace, Colaba',
  'New Delhi · The Oberoi, Dr. Zakir Hussain Marg',
  'Bengaluru · The Leela Palace, Old Airport Road',
  'Jaipur · Rambagh Palace Private Suite',
  'Dubai · DIFC Private Horology Suite',
  'London · Mayfair Client Salon',
];

export function PrivateSalonModal({ isOpen, onClose }: PrivateSalonModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salon, setSalon] = useState(INDIAN_SALONS[0]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="salon-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
    >
      <div className="luxury-glass relative w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <button
          type="button"
          onClick={handleResetAndClose}
          aria-label="Close private salon modal"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#c89b5c]/25 text-[#9c8f7e] transition-colors hover:border-[#e6c697] hover:text-[#f5efe6]"
        >
          <X className="h-4 w-4" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 pr-8">
              <p className="font-mono text-[10px] tracking-[0.32em] text-[#c89b5c] uppercase">
                AURELIA Royal Concierge
              </p>
              <h3
                id="salon-modal-title"
                className="font-serif text-3xl font-light text-[#f5efe6]"
              >
                Private Salon Viewing
              </h3>
              <p className="text-xs leading-relaxed text-[#9c8f7e] sm:text-sm">
                Experience Calibre AU-8920 Kalyan Skeleton in private quarters. Select your
                preferred salon for a bespoke consultation with our Head Watchmaker.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.22em] text-[#9c8f7e] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vikramaditya Singhania"
                  className="w-full rounded-xl border border-[#c89b5c]/25 bg-[#070503] px-4 py-2.5 text-sm text-[#f5efe6] placeholder-[#9c8f7e]/40 focus:border-[#e6c697] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.22em] text-[#9c8f7e] uppercase">
                  Private Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@domain.com"
                  className="w-full rounded-xl border border-[#c89b5c]/25 bg-[#070503] px-4 py-2.5 text-sm text-[#f5efe6] placeholder-[#9c8f7e]/40 focus:border-[#e6c697] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.22em] text-[#9c8f7e] uppercase">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 XXXXX"
                  className="w-full rounded-xl border border-[#c89b5c]/25 bg-[#070503] px-4 py-2.5 text-sm text-[#f5efe6] placeholder-[#9c8f7e]/40 focus:border-[#e6c697] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.22em] text-[#9c8f7e] uppercase">
                  Private Salon Location
                </label>
                <select
                  value={salon}
                  onChange={(e) => setSalon(e.target.value)}
                  className="w-full rounded-xl border border-[#c89b5c]/25 bg-[#070503] px-4 py-2.5 text-sm text-[#f5efe6] focus:border-[#e6c697] focus:outline-none"
                >
                  {INDIAN_SALONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full border border-[#e6c697]/70 bg-gradient-to-r from-[#c89b5c] to-[#e6c697] py-3 font-mono text-[11px] font-semibold tracking-[0.25em] text-[#050402] uppercase shadow-lg transition-all hover:scale-[1.02]"
            >
              Confirm Appointment Request
            </button>
          </form>
        ) : (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c89b5c]/50 bg-[#c89b5c]/15 text-[#e6c697]">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#c89b5c] uppercase">
              Provenance Registered
            </p>
            <h3 className="font-serif text-3xl font-light text-[#f5efe6]">
              Namaste, {name}
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#b9ab98]">
              Our Head Concierge at <span className="text-[#e6c697]">{salon}</span> will
              personally contact you within 24 hours to coordinate your private viewing of
              Calibre AU-8920.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-2 rounded-full border border-[#c89b5c]/40 px-6 py-2 font-mono text-[10px] tracking-[0.24em] text-[#e6c697] uppercase transition-colors hover:border-[#e6c697]"
            >
              Return to Showcase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
