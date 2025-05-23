import { useState, useCallback } from 'react';
import { PipelineBlock, BlockInstance } from '@/types/pipeline';

export interface UsePipelineBlocksOptions {
  gridSize?: number;
}

export function usePipelineBlocks(options: UsePipelineBlocksOptions = {}) {
  const { gridSize = 40 } = options;
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockInstance | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Snap to grid helper
  const snapToGrid = useCallback(
    (coord: number) => {
      return Math.round(coord / gridSize) * gridSize;
    },
    [gridSize],
  );

  // Add a new block to the canvas
  const addBlock = useCallback(
    (blockData: PipelineBlock, position: { x: number; y: number }) => {
      const newBlock: BlockInstance = {
        ...blockData,
        instanceId: `${blockData.id}_${Date.now()}`,
        position: {
          x: snapToGrid(position.x),
          y: snapToGrid(position.y),
        },
        config: {},
      };

      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlock(newBlock);
      setShowConfigModal(true);

      return newBlock;
    },
    [snapToGrid],
  );

  // Move an existing block
  const moveBlock = useCallback(
    (instanceId: string, newPosition: { x: number; y: number }) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.instanceId === instanceId
            ? {
                ...block,
                position: {
                  x: snapToGrid(newPosition.x),
                  y: snapToGrid(newPosition.y),
                },
              }
            : block,
        ),
      );
    },
    [snapToGrid],
  );

  // Update block configuration
  const updateBlockConfig = useCallback(
    (instanceId: string, config: Record<string, string | number | boolean | string[]>) => {
      setBlocks((prev) =>
        prev.map((block) => (block.instanceId === instanceId ? { ...block, config } : block)),
      );
      setShowConfigModal(false);
      setSelectedBlock(null);
    },
    [],
  );

  // Delete a block
  const deleteBlock = useCallback(
    (instanceId: string) => {
      setBlocks((prev) => prev.filter((block) => block.instanceId !== instanceId));
      if (selectedBlock?.instanceId === instanceId) {
        setSelectedBlock(null);
        setShowConfigModal(false);
      }
    },
    [selectedBlock],
  );

  // Select a block for configuration
  const selectBlock = useCallback((block: BlockInstance) => {
    setSelectedBlock(block);
    setShowConfigModal(true);
  }, []);

  // Close the configuration modal
  const closeConfigModal = useCallback(() => {
    setShowConfigModal(false);
    setSelectedBlock(null);
  }, []);

  return {
    blocks,
    selectedBlock,
    showConfigModal,
    addBlock,
    moveBlock,
    updateBlockConfig,
    deleteBlock,
    selectBlock,
    closeConfigModal,
    snapToGrid,
  };
}
