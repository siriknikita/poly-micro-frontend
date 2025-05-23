import { memo, RefObject } from 'react';
import { isEqual } from 'lodash';
import { TestChat } from './TestChat';
import { TestItem } from '@/types';
import { ResizeHandle } from './components';

interface ChatContainerProps {
  chatWidth: number;
  setIsDragging: (isDragging: boolean) => void;
  chatRef: RefObject<{ setInput: (text: string) => void }>;
  handleGenerateTest: (test: TestItem) => void;
}

/**
 * Container for the test chat with resize handle
 */
export const ChatContainer = memo<ChatContainerProps>(
  ({ chatWidth, setIsDragging, chatRef, handleGenerateTest }) => (
    <>
      <ResizeHandle onResizeStart={() => setIsDragging(true)} />

      <div
        style={{ width: chatWidth }}
        className="flex border-l border-gray-200 dark:border-gray-700"
      >
        <TestChat ref={chatRef} onGenerateTest={handleGenerateTest} />
      </div>
    </>
  ),
  (prevProps, nextProps) => {
    return isEqual(prevProps.chatWidth, nextProps.chatWidth);
  },
);
