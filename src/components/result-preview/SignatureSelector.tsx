
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

interface SignatureSelectorProps {
  leftSignatory: string;
  rightSignatory: string;
  setLeftSignatory: (value: string) => void;
  setRightSignatory: (value: string) => void;
}

const SignatureSelector: React.FC<SignatureSelectorProps> = ({
  leftSignatory,
  rightSignatory,
  setLeftSignatory,
  setRightSignatory
}) => {
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-md font-medium mb-3">Signature Options</h3>
      <div className="flex flex-wrap gap-6">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-2">First Signature</label>
          <Select value={leftSignatory} onValueChange={setLeftSignatory}>
            <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700">
              <SelectValue placeholder="Select signatory" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white dark:bg-gray-700 z-50">
              <SelectItem value="Class Teacher">Class Teacher</SelectItem>
              <SelectItem value="Form Teacher">Form Teacher</SelectItem>
              <SelectItem value="Section Leader">Section Leader</SelectItem>
              <SelectItem value="Rector">Rector</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-2">Second Signature</label>
          <Select value={rightSignatory} onValueChange={setRightSignatory}>
            <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700">
              <SelectValue placeholder="Select signatory" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white dark:bg-gray-700 z-50">
              <SelectItem value="Class Teacher">Class Teacher</SelectItem>
              <SelectItem value="Form Teacher">Form Teacher</SelectItem>
              <SelectItem value="Section Leader">Section Leader</SelectItem>
              <SelectItem value="Rector">Rector</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SignatureSelector;
