
import React from "react";

interface SignatureSectionProps {
  leftSignatory: string;
  rightSignatory: string;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ leftSignatory, rightSignatory }) => {
  return (
    <div className="flex justify-between items-end mt-12">
      <div className="text-center">
        <div className="mb-2 h-20">
          {/* Left signature placeholder */}
          <div className="border-b border-gray-400 w-40 mx-auto"></div>
        </div>
        <p className="font-medium">{leftSignatory}</p>
      </div>
      <div className="text-center">
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
