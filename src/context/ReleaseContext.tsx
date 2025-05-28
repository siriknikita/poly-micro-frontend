import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { db, Release } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { IndexableType } from 'dexie';

interface ReleaseContextType {
  latestRelease: Release | null;
  isReleaseModalOpen: boolean;
  hasUnacknowledgedRelease: boolean;
  acknowledgeRelease: (userId: IndexableType) => Promise<void>;
  openReleaseModal: () => void;
  closeReleaseModal: () => void;
  allReleases: Release[];
}

const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export const ReleaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [hasUnacknowledgedRelease, setHasUnacknowledgedRelease] =
    useState(false);

  const latestRelease = useLiveQuery(
    async () => {
      return (await db.releases.where('isLatest').equals(1).first()) || null;
    },
    [],
    null,
  );

  const allReleases =
    useLiveQuery(async () => {
      return await db.releases.orderBy('releaseDate').reverse().toArray();
    }) || [];

  const userAcknowledgmentsQuery = useLiveQuery(async () => {
    // In a real app, you'd get the current user ID from auth context
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return [];

    return await db.userAcknowledgments
      .where('userId')
      .equals(currentUserId)
      .toArray();
  });

  // Wrap in useMemo to avoid recreating on every render
  const userAcknowledgments = useMemo(
    () => userAcknowledgmentsQuery || [],
    [userAcknowledgmentsQuery],
  );

  // Helper function to get current user ID
  const getCurrentUserId = async (): Promise<IndexableType | null> => {
    // In a real app, this would come from authentication
    // For now, we'll just get the first user as a placeholder
    const firstUser = await db.users.toCollection().first();
    return firstUser?.id || null;
  };

  useEffect(() => {
    const checkUnacknowledgedReleases = async () => {
      if (!latestRelease || !latestRelease.id) return;

      const currentUserId = await getCurrentUserId();
      if (!currentUserId) return;

      const hasAcknowledged = userAcknowledgments.some(
        (ack) => ack.releaseId === latestRelease.id,
      );

      setHasUnacknowledgedRelease(!hasAcknowledged);

      // Auto-open the modal if there's an unacknowledged release
      if (!hasAcknowledged) {
        setIsReleaseModalOpen(true);
      }
    };

    checkUnacknowledgedReleases();
  }, [latestRelease, userAcknowledgments]);

  const acknowledgeRelease = async (userId: IndexableType) => {
    if (!latestRelease || !latestRelease.id) return;

    await db.userAcknowledgments.add({
      userId,
      releaseId: latestRelease.id,
      acknowledgedAt: new Date(),
    });

    setHasUnacknowledgedRelease(false);
    setIsReleaseModalOpen(false);
  };

  const openReleaseModal = () => setIsReleaseModalOpen(true);
  const closeReleaseModal = () => setIsReleaseModalOpen(false);

  return (
    <ReleaseContext.Provider
      value={{
        latestRelease,
        isReleaseModalOpen,
        hasUnacknowledgedRelease,
        acknowledgeRelease,
        openReleaseModal,
        closeReleaseModal,
        allReleases,
      }}
    >
      {children}
    </ReleaseContext.Provider>
  );
};

// Export the context for use in the hook file
export { ReleaseContext };
