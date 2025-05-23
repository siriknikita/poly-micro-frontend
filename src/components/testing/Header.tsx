import { memo } from 'react';
import { isEqual } from 'lodash';
import { Play, MessageSquare } from 'lucide-react';
import { IconButton } from './components';

interface HeaderProps {
  selectedMicroservice: { name: string };
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  handleRunAllTests: () => void;
}

/**
 * Header component for the testing page
 */
export const Header = memo<HeaderProps>(
  ({ selectedMicroservice, showChat, setShowChat, handleRunAllTests }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Testing: {selectedMicroservice.name}
        </h2>
        <div className="flex items-center space-x-2">
          <IconButton
            onClick={handleRunAllTests}
            icon={<Play className="h-4 w-4" />}
            label="Run All Tests"
            variant="primary"
            size="md"
            aria-label="Run all tests"
          />
          <IconButton
            onClick={() => setShowChat(!showChat)}
            icon={<MessageSquare className="h-5 w-5" />}
            variant={showChat ? 'outline' : 'active'}
            title={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
            aria-label={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
          />
        </div>
      </div>
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.selectedMicroservice, nextProps.selectedMicroservice) &&
      isEqual(prevProps.showChat, nextProps.showChat)
    );
  },
);
