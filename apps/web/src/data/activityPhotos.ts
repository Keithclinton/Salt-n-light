export interface ActivityPhoto {
  /** Path relative to `apps/web/public` — e.g. `/images/activities/activity-07.jpg` */
  src: string;
  /** Read aloud by screen readers; never shown on screen. */
  alt: string;
}

/**
 * The activity gallery — an unordered collection, rendered as a mosaic.
 * To add a photo: drop the file into `apps/web/public/images/activities/`,
 * add an entry here, and redeploy. The section hides itself when empty.
 */
export const activityPhotos: ActivityPhoto[] = [
  {
    src: '/images/activities/activity-01.jpg',
    alt: 'A woman singing into a microphone with her hand raised',
  },
  {
    src: '/images/activities/activity-02.jpg',
    alt: 'Members seated together in conversation at a gathering',
  },
  {
    src: '/images/activities/activity-03.jpg',
    alt: 'A group cheering and laughing during a gathering',
  },
  {
    src: '/images/activities/activity-04.jpg',
    alt: 'Three members sharing a laugh together',
  },
  {
    src: '/images/activities/activity-05.jpg',
    alt: 'Two members embracing and smiling for the camera',
  },
  {
    src: '/images/activities/activity-06.jpg',
    alt: 'The Salt & Light community gathered outdoors for a group photo',
  },
];
