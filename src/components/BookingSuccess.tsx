import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface BookingSuccessProps {
  bookingReference: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingSuccess({ bookingReference, isOpen, onClose }: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = bookingReference;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your booking request has been submitted successfully. The accommodation owner will contact you soon to confirm your booking.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border text-gray-900 font-mono text-sm">
                {bookingReference}
              </code>
              <button
                onClick={copyReference}
                className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition-colors"
                title="Copy reference"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs mt-1">Copied to clipboard!</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Next Steps:</strong><br />
              1. Save your booking reference<br />
              2. Wait for the owner to contact you<br />
              3. You'll receive exact location details after confirmation
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}