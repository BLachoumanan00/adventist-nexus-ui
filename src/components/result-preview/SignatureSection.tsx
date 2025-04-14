
import React from "react";

interface SignatureSectionProps {
  leftSignatory: string;
  rightSignatory: string;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ leftSignatory, rightSignatory }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-12 gap-8 sm:gap-4">
      <div className="text-center w-full sm:w-auto">
        <div className="mb-2 h-20">
          {/* Left signature placeholder */}
          <div className="border-b border-gray-400 w-40 mx-auto"></div>
        </div>
        <p className="font-medium">{leftSignatory}</p>
      </div>
      <div className="text-center w-full sm:w-auto">
        <div className="mb-2 h-20">
          {/* Right signature placeholder */}
          <div className="border-b border-gray-400 w-40 mx-auto"></div>
        </div>
        <p className="font-medium">{rightSignatory}</p>
      </div>
    </div>
  );
};

export default SignatureSection;
