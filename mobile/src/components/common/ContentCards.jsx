import React from 'react';
import Badge from '../ui/Badge';
import DiaryRow from './DiaryRow';
import FavoriteButton from './FavoriteButton';

const WEEK = 7 * 24 * 60 * 60 * 1000;

/** A notice as one line of the diary. `first` draws the top rule of the page. */
export function NoticeCard({ notice, onPress, first = false }) {
  const age = Date.now() - new Date(notice.date).getTime();
  const isNew = age >= 0 && age < WEEK;
  const badges = [];
  if (notice.isPinned) badges.push(<Badge key="pin" label="Pinned" tone="accent" />);
  if (notice.isImportant) badges.push(<Badge key="imp" label="Important" tone="danger" />);
  if (notice.pdfUrl) badges.push(<Badge key="pdf" label="PDF attached" tone="neutral" />);

  return (
    <DiaryRow
      first={first}
      date={notice.date}
      title={notice.title}
      subtitle={notice.content}
      isNew={isNew}
      badges={badges.length ? badges : null}
      onPress={onPress}
      right={<FavoriteButton itemType="notice" itemId={notice._id} />}
    />
  );
}

/** An event as one line of the diary. */
export function EventCard({ event, onPress, first = false }) {
  return (
    <DiaryRow
      first={first}
      date={event.date}
      title={event.title}
      subtitle={event.location || null}
      onPress={onPress}
      right={<FavoriteButton itemType="event" itemId={event._id} />}
    />
  );
}
