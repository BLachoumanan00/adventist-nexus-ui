
import React from "react";
import { Check, X } from "lucide-react";

interface ResultStatusFooterProps {
  isPassing: boolean;
}

const ResultStatusFooter: React.FC<ResultStatusFooterProps> = ({ isPassing }) => {
  return (
    <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-full ${isPassing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {isPassing ? (
            <Check size={18} className="text-green-600 dark:text-green-400" />
          ) : (
            <X size={18} className="text-red-600 dark:text-red-400" />
          )}
        </div>
        <span className="font-medium">
          {isPassing ? 'Passed' : 'Failed'}
        </span>
      </div>
      
      <div>
        <p className="text-sm text-right text-gray-600 dark:text-gray-400">
          Generated on {new Date().toLocaleDateString('en-GB')}
        </p>
        <p className="text-sm text-right text-gray-600 dark:text-gray-400">
          Adventist College Management System
        </p>
      </div>
    </div>
  );
};

export default ResultStatusFooter;
