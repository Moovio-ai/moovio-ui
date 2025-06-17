
import React from 'react';
import { Switch } from './ui/switch';
import { Zap, Globe } from 'lucide-react';

interface CommunicationModeSelectorProps {
  useSSE: boolean;
  onToggle: (enabled: boolean) => void;
  hasApiKey: boolean;
}

export const CommunicationModeSelector: React.FC<CommunicationModeSelectorProps> = ({
  useSSE,
  onToggle,
  hasApiKey,
}) => {
  const isDisabled = !hasApiKey;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-moovio-gray/30 rounded-lg border border-gray-700/40">
      <div className="flex items-center gap-2">
        <Globe size={16} className={`${useSSE ? 'text-gray-400' : 'text-moovio-red'}`} />
        <span className={`text-sm font-medium ${useSSE ? 'text-gray-400' : 'text-white'}`}>
          REST
        </span>
      </div>
      
      <Switch
        checked={useSSE && hasApiKey}
        onCheckedChange={onToggle}
        disabled={isDisabled}
        className="data-[state=checked]:bg-moovio-red"
      />
      
      <div className="flex items-center gap-2">
        <Zap size={16} className={`${useSSE && hasApiKey ? 'text-moovio-red' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${useSSE && hasApiKey ? 'text-white' : 'text-gray-400'}`}>
          SSE
        </span>
      </div>
      
      {isDisabled && (
        <span className="text-xs text-gray-500 ml-2">
          (API key required)
        </span>
      )}
    </div>
  );
};
