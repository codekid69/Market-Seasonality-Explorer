import { render, screen, fireEvent } from '@testing-library/react';
import { FilterControls } from '../FilterControls';
import { FilterState } from '../../../types/market';

describe('FilterControls', () => {
  const mockFilters: FilterState = {
    timePeriod: '1Y',
    dataOverlay: 'heatmap',
    calendarView: 'daily',
    instrument: 'BTC',
  };

  it('renders filter section headings', () => {
    render(
      <FilterControls
        filters={mockFilters}
        onFiltersChange={() => {}}
        onClearFilters={() => {}}
      />
    );

    expect(screen.getByText('Time Period')).toBeInTheDocument();
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
    expect(screen.getByText('Instrument')).toBeInTheDocument();
  });
});
