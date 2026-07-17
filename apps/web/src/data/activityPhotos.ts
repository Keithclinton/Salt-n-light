export interface ActivityPhoto {
  /** Path relative to `apps/web/public` — e.g. `/images/activities/retreat.jpg` */
  src: string;
  /** Describes the photo for screen readers and search engines. */
  alt: string;
  /** Shown over the photo on hover and under it in the lightbox. */
  caption: string;
}

/**
 * The activity gallery. To add a photo: drop the file into
 * `apps/web/public/images/activities/`, add an entry here, and redeploy.
 * The gallery section hides itself when this list is empty.
 */
export const activityPhotos: ActivityPhoto[] = [
  {
    src: '/images/activities/placeholder-1.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Sunday Gathering',
  },
  {
    src: '/images/activities/placeholder-2.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Community Outreach',
  },
  {
    src: '/images/activities/placeholder-3.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Bible Study',
  },
  {
    src: '/images/activities/placeholder-4.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Worship Night',
  },
  {
    src: '/images/activities/placeholder-5.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Leadership Training',
  },
  {
    src: '/images/activities/placeholder-6.svg',
    alt: 'Placeholder for an activity photo',
    caption: 'Youth Retreat',
  },
];
