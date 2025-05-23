import { db, Release, ReleaseChange } from '../db/db';
import { IndexableType } from 'dexie';

/**
 * Creates a new release and sets it as the latest
 * @param version Version number (e.g., "1.2.0")
 * @param title Release title
 * @param description Release description
 * @param changes Array of changes in this release
 * @returns The ID of the newly created release
 */
export const createNewRelease = async (
  version: string,
  title: string,
  description: string,
  changes: ReleaseChange[],
): Promise<IndexableType> => {
  // First, update all existing releases to not be latest
  await db.releases.where('isLatest').equals(1).modify({ isLatest: 0 });

  // Create the new release
  const newRelease: Release = {
    version,
    title,
    description,
    changes,
    releaseDate: new Date(),
    isLatest: 1,
  };

  // Add to database and return the ID
  return await db.releases.add(newRelease);
};

/**
 * Gets all releases ordered by date (newest first)
 * @returns Array of all releases
 */
export const getAllReleases = async (): Promise<Release[]> => {
  return await db.releases.orderBy('releaseDate').reverse().toArray();
};

/**
 * Gets the latest release
 * @returns The latest release or null if none exists
 */
export const getLatestRelease = async (): Promise<Release | null> => {
  return (await db.releases.where('isLatest').equals(1).first()) || null;
};

/**
 * Checks if a user has acknowledged the latest release
 * @param userId User ID to check
 * @returns True if the user has acknowledged the latest release
 */
export const hasUserAcknowledgedLatestRelease = async (userId: IndexableType): Promise<boolean> => {
  const latestRelease = await getLatestRelease();
  if (!latestRelease || !latestRelease.id) return true; // No release to acknowledge

  const acknowledgment = await db.userAcknowledgments
    .where({ userId, releaseId: latestRelease.id })
    .first();

  return !!acknowledgment;
};

/**
 * Marks a release as acknowledged by a user
 * @param userId User ID
 * @param releaseId Release ID
 */
export const acknowledgeRelease = async (
  userId: IndexableType,
  releaseId: IndexableType,
): Promise<void> => {
  await db.userAcknowledgments.add({
    userId,
    releaseId,
    acknowledgedAt: new Date(),
  });
};

/**
 * Example of how to use this utility when deploying a new version
 */
export const exampleDeployNewVersion = async (): Promise<void> => {
  await createNewRelease(
    '1.3.0',
    'May 2025 Update',
    'This update brings several new features and improvements to the Poly Micro Manager.',
    [
      {
        type: 'feature',
        description: 'Added new CI/CD pipeline integration',
      },
      {
        type: 'improvement',
        description: 'Enhanced microservice discovery process',
      },
      {
        type: 'fix',
        description: 'Fixed issue with project selection in the dashboard',
      },
    ],
  );

  console.log('New release created successfully!');
};
