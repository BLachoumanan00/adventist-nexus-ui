import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }[];
  showFilterCount?: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  showFilterCount = true
}) => {
  const activeFiltersCount = filters.filter(f => f.value && f.value !== 'all').length;

  const clearAllFilters = () => {
    onSearchChange('');
    filters.forEach(filter => filter.onChange('all'));
  };

  return (
    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
        <Input
          placeholder="Search students, subjects, or IDs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 min-h-[48px] text-base touch-manipulation"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 min-h-[32px] no-min-height touch-manipulation"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 flex-1">
          {filters.map((filter, index) => (
            <Select key={index} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-full sm:w-[160px] min-h-[48px] sm:min-h-[40px] touch-manipulation">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent className="z-50 bg-background border border-border">
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Active filters count and clear all */}
        {(searchTerm || activeFiltersCount > 0) && (
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            {showFilterCount && activeFiltersCount > 0 && (
              <Badge variant="secondary" className="flex-shrink-0">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs min-h-[40px] sm:min-h-[36px] touch-manipulation flex-1 sm:flex-initial"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;