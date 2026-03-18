import { getBadgeClass, capitalise } from '@/utils/helpers';

export default function StatusBadge({ value }) {
  if (!value) return null;
  return (
    <span className={getBadgeClass(value)}>
      {capitalise(value)}
    </span>
  );
}
