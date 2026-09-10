import { Spinner } from '@/components/Spinner/Spinner';
import { Overlay } from './FullScreenLoader.styles';

export function FullScreenLoader() {
  return (
    <Overlay role="status" aria-live="polite">
      <Spinner />
    </Overlay>
  );
}
